import mongoose from "mongoose";
import {asyncHandler} from "../../utils/AsyncHandels.js"
import {ApiError} from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiRes.js"
import {uploadResult} from "../../utils/Cloudinary.js"
import {User} from "../../models/user.js"
import {Cart} from "../../models/cart.js"
import {Product} from "../../models/addproduct.js"
import {Order} from "../../models/orderSchema.js"
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req,res)=>{
    const {username,fullname,email,password,address,mobile_no} = req.body

    if ([username, fullname, email, password, address, mobile_no].some(field => !field || !field.trim())) {
        throw new ApiError(400, "ALL FIELDS ARE REQUIRED");
    }

    const existedUser = await User.findOne({
        $or : [{mobile_no},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"user already exists");
    }

    if (!req.files || !req.files.avatar || !req.files.avatar[0]?.path) {
        throw new ApiError(400, "Profile image is required");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is missing");
    }

    const avatar = await uploadResult(avatarLocalPath);

    if(!avatar){
        throw new ApiError(500,"something went wrong");
    }

    const user = await User.create({
        fullname : fullname.toLowerCase(),
        username : username.toLowerCase(),
        password,
        email,
        mobile_no,
        avatar: avatar.url,
        address : address,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "user can;t be registered")
    }

    return res.status(201).json(
        new ApiResponse(200,"done",createdUser)
    )
})

const genrateAccessAndRefreshTokens = async(userID) => {
    try{
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave : false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"something went wrong in refresh token")
    }
}

const loginUser = asyncHandler(async (req,res)=>{
    

    const {email,password} = req.body;

    if(!email){
        throw new ApiError(400,"something is missing please check all input fields")
    }
    if(!password){
        throw new ApiError(400,"password is missing")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404,"user does not exist ")
    }

    const isValid = await user.isPasswordCorrect(password)

    if(!isValid){
        throw new ApiError(401,"password is not valid")
    }

    const {accessToken , refreshToken} = await genrateAccessAndRefreshTokens(user._id);

    const loggedUser = await User.findById(user._id).select(" -password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : 'None'
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,"user logged in succesfully",{
                user : loggedUser,accessToken,refreshToken
            },
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set : {
            refreshToken : undefined
        }
    },{
        new:true
    })

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : 'none',
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out")
    )
})

const getUserOrders = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(400, "Unauthorized request");
    }

    const userOrders = await Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
        { $unwind: "$products" },
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
                from: "sellers",
                localField: "productDetails.seller",
                foreignField: "_id",
                as: "sellerDetails"
            }
        },
        { $unwind: "$sellerDetails" }, // Added this line
        {
            $group: {
                _id: "$_id",
                order_date: { $first: "$order_date" },
                total_price: { $first: "$total_price" },
                status: { $first: "$status" },
                payment_status: { $first: "$payment_status" },
                products: {
                    $push: {
                        product_id: "$productDetails._id",
                        name: "$productDetails.name",
                        image: "$productDetails.main_image",
                        size : "$products.size",
                        quantity: "$products.quantity",
                        price: "$products.price",
                        seller: {
                            seller_id: "$sellerDetails._id",
                            fullname: "$sellerDetails.name",
                            email: "$sellerDetails.email",
                            mobile_no: "$sellerDetails.contact"
                        }
                    }
                }
            }
        },
        { $sort: { order_date: -1 } }
    ]);

    res.status(200).json(new ApiResponse(200, "User Orders Retrieved Successfully", { orders: userOrders }));
});


const addToCart = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const { productID, quantity,size } = req.body;

    // Check if the product exists
    const product = await Product.findById(productID);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Convert quantity to a valid number
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: userID });

    if (!cart) {
        // Create a new cart if it doesn't exist
        cart = await Cart.create({
            user: userID,
            items: [
                {
                    product: productID,
                    seller: product.seller,
                    quantity: parsedQuantity,
                    size : size,
                    price: product.new_price,
                }
            ],
            total_price: parsedQuantity * product.new_price,
        });
    } else {
        
        const existingItem = cart.items.find(
            item => item.product.toString() === productID && item.size === size);

        if (existingItem) {
            // Update quantity if product exists
            existingItem.quantity += parsedQuantity;
        } else {
            // Add new product to cart
            cart.items.push({
                product: productID,
                seller: product.seller,
                quantity: parsedQuantity,
                size : size,
                price: product.new_price,
            });
        }
        await cart.save();
    }

    res.status(200).json(new ApiResponse(200, "Item added to cart", cart));
})

const removeFromCart = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const { productID, size } = req.body;

    if (!productID || !size) {
        throw new ApiError(400, "Product ID and size are required");
    }

    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
        throw new ApiError(400, "No cart is available");
    }

    // Find the index of the item in the cart with the matching product and size
    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productID && item.size === size
    );

    if (itemIndex === -1) {
        throw new ApiError(400, "Product not found in cart");
    }

    if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
    } else {
        cart.items.splice(itemIndex, 1);
    }

    // Save the cart after modification
    await cart.save();

    res.status(200).json(new ApiResponse(200, "Item removed successfully", cart));
});


const getallProduct = asyncHandler(async (req, res) => {
    const { search, category, minPrice, maxPrice, page = 1, limit = 32} = req.query;

    // Initialize query object
    let query = {};

    // Apply filters only if they are provided
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive search
            { description: { $regex: search, $options: "i" } }
        ];
    }

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {
        query.new_price = {};
        if (minPrice) query.new_price.$gte = parseFloat(minPrice);
        if (maxPrice) query.new_price.$lte = parseFloat(maxPrice);
    }

    if (Object.keys(query).length === 0) {
        query = {}; // Reset to fetch all products
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch products from database
    const products = await Product.find(query)
        .sort({ createdAt: -1 }) // Sort by newest
        .skip(skip)
        .limit(parseInt(limit));

    // Count total products for pagination
    const totalProducts = await Product.countDocuments(query);

    if (products.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, "No products found. Here are some popular products:", {
                products: await Product.find({}).sort({ createdAt: -1 }).limit(10), // Display 10 latest products
                totalProducts,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalProducts / limit)
            })
        );
    }

    res.status(200).json(
        new ApiResponse(200, "Products retrieved successfully", {
            products,
            totalProducts,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit)
        })
    );
});

const getCart = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(404, "User not found");
    }

    const userID = req.user._id;

    const cart = await Cart.aggregate([
        // Match the cart by the user's ID
        { $match: { user: new mongoose.Types.ObjectId(userID) } },

        // Unwind items to handle each product individually
        { $unwind: "$items" },

        // Lookup product details
        {
            $lookup: {
                from: "products", // Corrected collection name
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails",
            }
        },
        { $unwind: "$productDetails" }, // Corrected typo

        // Lookup seller details
        {
            $lookup: {
                from: "sellers",
                localField: "items.seller",
                foreignField: "_id",
                as: "sellerDetails",
            }
        },
        { $unwind: "$sellerDetails" }, // Corrected typo

        // Group back into a single cart document
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                total_price: { $first: "$total_price" },
                items: {
                    $push: {
                        quantity: "$items.quantity", // Corrected field path
                        size: "$items.size",
                        price: "$items.price",
                        product: {
                            _id: "$productDetails._id",
                            name: "$productDetails.name",
                            main_image: "$productDetails.main_image",
                        },
                        seller: {
                            fullname: "$sellerDetails.fullname",
                            address: "$sellerDetails.address",
                            email: "$sellerDetails.email",
                            mobile_no: "$sellerDetails.mobile_no"
                        }
                    }
                }
            }
        }
    ]);

    if (!cart.length) {
        throw new ApiError(404, "Cart not found");
    }

    res.status(200).json(
        new ApiResponse(200, "User cart fetched", {
            cart: cart[0], // Return the first (and only) cart document
        })
    );
});

const getCurrentUser = asyncHandler(async (req,res) =>{
    if(!req.user || !req.user._id){
        throw new ApiError(404,"user logged out");
    }
    const user = req.user;
    
    res.status(200).json(
        new ApiResponse(200,"user data retrived",{
            user
        })
    )
})

const placeOrder = asyncHandler(async (req, res) => {
    const userID = req.user._id;

    if (!userID) {
        throw new ApiError(400, "Unauthorized request");
    }

    const cartData = await Cart.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(userID) }
        },
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $group: {
                _id: "$user",
                products: {
                    $push: {
                        product: "$productDetails._id",
                        seller: "$productDetails.seller",
                        quantity: "$items.quantity",
                        size : "$items.size",
                        price: "$productDetails.new_price"
                    }
                },
                total_price: { $sum: { $multiply: ["$items.quantity", "$productDetails.new_price"] } }
            }
        }
    ]);

    if (!cartData.length) {
        throw new ApiError(400, "Cart is empty");
    }

    const orderData = cartData[0];

    for (const item of orderData.products) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
        }

        // Reduce stock
        product.stock -= item.quantity;
        await product.save();
    }

    const newOrder = await Order.create({
        user: userID,
        products: orderData.products,
        total_price: orderData.total_price,
        status: "pending",
        payment_status: "completed",
    });

    await Cart.findOneAndDelete({ user: userID });

    res.status(201).json(new ApiResponse(200, "Order placed successfully", newOrder));
});

const reviwes = asyncHandler(async (req, res) => {
    const { productID, rating, comment } = req.body;
    const userID = req.user._id;

    // Validate required fields
    if (!productID || !rating || !comment) {
        throw new ApiError(400, "Product ID, rating, and comment are required");
    }

    let reviewImage = null;

    // If an image is uploaded, process it
    if (req.files?.review_image) {
        const reviewImagePath = req.files.review_image[0].path;
        reviewImage = await uploadResult(reviewImagePath);
        if (!reviewImage) {
            throw new ApiError(500, "Internal cloud error");
        }
    }

    // Find the product and update its reviews
    const product = await Product.findById(productID);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Add the new review
    const newReview = {
        user: userID,
        rating: parseFloat(rating),
        comment,
        review_image: reviewImage || null, // Only add image if available
        date: new Date()
    };

    product.reviews.push(newReview);

    await product.save();

    res.status(200).json(new ApiResponse(200, "Review added successfully", product.reviews));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserOrders,
    addToCart,
    placeOrder,
    removeFromCart,
    getallProduct,
    reviwes,
    getCurrentUser,
    getCart,
}


