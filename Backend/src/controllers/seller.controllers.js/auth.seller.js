import mongoose from "mongoose";
import {asyncHandler} from "../../utils/AsyncHandels.js"
import {ApiError} from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiRes.js"
import {uploadResult} from "../../utils/Cloudinary.js"
import {Seller} from "../../models/seller.js"
import jwt from "jsonwebtoken"
import { Order } from "../../models/orderSchema.js";
import { Product } from "../../models/addproduct.js";

const registerSeller = asyncHandler(async (req,res)=>{
    const {password,fullname,email,aadhaar_no,mobile_no,shop_address} = req.body

    
    if([password,fullname,email,aadhaar_no,mobile_no,shop_address].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"ALL  FIELDS ARE REQUIRED")
    }

    const existedSeller  = await Seller.findOne({
        $or : [{aadhaar_no},{email},{mobile_no}]
    })

    if(existedSeller){
        throw new ApiError(409,"seller is already exists please check input fields");
    }

    if (!req.files || !req.files.avatar || !req.files.avatar[0]?.path) {
        throw new ApiError(400, "Profile image is required");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required");
    }

    const avatar = await uploadResult(avatarLocalPath);

    if(!avatar){
        throw new ApiError(500,"avatar is not saved sorry");
    }

    const person = await Seller.create({
        fullname : fullname.toLowerCase(),
        avatar: avatar.url,
        password,
        email,
        aadhaar_no,
        mobile_no,
        shop_address : shop_address.toLowerCase(),
    })

    const createdUser = await Seller.findById(person._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500,"something went wrong in server")
    }

    return res.status(201).json(
        new ApiResponse(200,"success",createdUser)
    )
})

const genrateAccessRefreshToken = async (sellerID)=>{
    try {
        const seller = await Seller.findById(sellerID);
        const accessToken = seller.generateAccessToken()
        const refreshToken = seller.generateRefreshToken()
        seller.refreshToken = refreshToken

        await seller.save({validateBeforeSave : false})
        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500,"something went wrong");
    }
}

const loginSeller = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "ALL FIELDS ARE REQUIRED");
    }
    
    const seller = await Seller.findOne({email})

    if(!seller){
        throw new ApiError(404,"seller is missing please register first")
    }
    
    const isValid = await seller.isPasswordCorrect(password)

    if(!isValid){
        throw new ApiError(401,"password is not valid")
    }

    
    const {accessToken , refreshToken} = await genrateAccessRefreshToken(seller._id);

    
    const loggedseller = await Seller.findById(seller._id).select(" -password -refreshToken")

    const options = {
        httpOnly : true,
        secure : false,
        sameSite : 'Lax' 
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,"user logged in ",{
                seller : loggedseller,accessToken,refreshToken
            }
        )
    )
})

const logoutSeller = asyncHandler(async (req,res)=>{
    Seller.findByIdAndDelete(req.seller._id,{
        $set : {
            refreshToken : undefined
        }
    },{
        new : true
    })

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out")
    )
})

const updatePass = asyncHandler(async (req,res) =>{
    const {oldPassword,currPassword} = req.body

    if(!oldPassword || !currPassword){
        throw new ApiError(400,"all fields are required")
    }

    const seller = await Seller.findById(req.seller._id);

    if(!seller){
        throw new ApiError(401,"User not found")
    }

    const isValid = await seller.isPasswordCorrect(oldPassword)

    if(!isValid){
        throw new ApiError(401,"current password is not valid");
    }

    seller.password = currPassword

    await seller.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(200,{},"pasword changed")
    )
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(400,"unauthorized")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const seller = await Seller.findById(decodedToken?._id)

        if(incomingRefreshToken !== seller?.refreshToken){
            throw new ApiError(400,"invalid refreshtoken or expired")
        }

        const options ={
            httpOnly:true,
            secure : true
        }

        const {accessToken , newrefreshToken} = await genrateAccessRefreshToken(seller._id)

        return res.status(200)
        .cookie("accessToken",accessToken)
        .cookie("refreshToken",newrefreshToken)
        .json(
            new ApiResponse(200,
                accessToken,newrefreshToken,"Access token refrreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid")
    }
})

const getOrder = asyncHandler(async (req, res) => {
    const sellId = req.seller._id;
    if (!sellId) {
        throw new ApiError(400, "Unauthorized request");
    }

    const history = await Order.aggregate([
        { $unwind: "$products" },
        {
            $match: {
                "products.seller": new mongoose.Types.ObjectId(sellId)
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "products.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $project: {
                _id: 1, // Order ID
                user: 1, // Buyer
                order_date: 1,
                status: 1,
                payment_status : 1,
                "product_name": "$productDetails.name",
                "product_image": "$productDetails.main_image",
                "required_size" : "$products.size",
                "quantity": "$products.quantity",
                "price_per_unit": "$products.price",
                "total_price": { $multiply: ["$products.quantity", "$products.price"] },
                "buyer_name": "$userDetails.fullname",
                "buyer_email": "$userDetails.email",
                "buyer_address" : "$userDetails.address"
            }
        },
        { $sort: { order_date: -1 } }
    ]);

    res.status(200).json(new ApiResponse(200, "Seller's sales history retrieved successfully", { sells: history }));
});

const removeProduct = asyncHandler(async (req, res) => {
    if (!req.seller || !req.seller._id) {
        throw new ApiError(403, "Unauthorized request");
    }

    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const deletedProduct = await Product.findOneAndDelete({
        _id: productId,
        seller: req.seller._id, // Ensure the seller is deleting their own product
    });

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found or already deleted");
    }

    res.status(200).json(new ApiResponse(200, "Product removed successfully"));
});

const getCurrentSeller = asyncHandler(async (req,res) =>{
    if(!req.seller || !req.seller._id){
        console.log("user logged problem")
        throw new ApiError(404,"user logged out");
    }
    const seller = req?.seller
    console.log(seller)
    res.status(200).json(
        new ApiResponse(200,"user data retrived",{
            seller
        })
    )
})

const getallProduct = asyncHandler(async (req, res) => {
    if (!req.seller || !req.seller._id) {
        throw new ApiError(403, "Unauthorized request");
    }

    const { page = 1, limit = 10 } = req.query; // Default values for pagination

    const query = { seller: req.seller._id }; // Get only seller's products

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch products with pagination
    const products = await Product.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(parseInt(limit));

    // Count total products for pagination info
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json(
        new ApiResponse(200, "Products retrieved successfully", {
            products,
            totalProducts,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit),
        })
    );
});

export {
    registerSeller,
    loginSeller,
    logoutSeller,
    updatePass,
    refreshAccessToken,
    getOrder,
    removeProduct,
    getallProduct,
    getCurrentSeller,
}