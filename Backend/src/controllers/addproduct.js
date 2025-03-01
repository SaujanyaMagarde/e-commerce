import mongoose from "mongoose";
import {asyncHandler} from "../utils/AsyncHandels.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRes.js"
import {uploadResult} from "../utils/Cloudinary.js"
import { Product } from "../models/addproduct.js"

// const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const registerProduct = asyncHandler(async (req,res)=>{

    if (!req.seller) {
        throw new ApiError(403, "Access Denied: Only sellers can register products");
    }

    
    const {name,description,category,new_price,old_price,stock} = req.body

    // const sizes = typeof req.body.sizes === "string" ? JSON.parse(req.body.sizes) : req.body.sizes;

    if ([name, category, description].some((field) => String(field)?.trim() === "") ||
        [new_price, old_price, stock].some((field) => field === undefined || isNaN(Number(field)))) {
        throw new ApiError(400, "All fields are required and must be valid");
    }

    if (!req.files || !req.files.main_image || !req.files.main_image[0]?.path) {
        throw new ApiError(400, "Product image is required");
    }
    
    const product_main_image_path = req.files?.main_image[0]?.path;

    if(!product_main_image_path){
        throw new ApiError(400,"product image is required")
    }
    
    const product_main_image = await uploadResult(product_main_image_path);

    if(!product_main_image){
        throw new ApiError(500,"server side image storage error")
    }
    const extra_image_path = req.files.extra_image ? req.files.extra_image.map(file => file.path) : [];

    if(extra_image_path.length > 5){
        throw new ApiError(400,"you should only upload 5 image of product")
    }

    const extra_images = await Promise.all(
        extra_image_path.map(async (path) => {
            const upload = await uploadResult(path);
            console.log("Uploaded Image:", upload);
            return upload;
        })
    );

    if (extra_images.includes(null)) {
        throw new ApiError(500, "Error uploading extra images");
    }


    const extra_image_arr = extra_images.map(img => img.url);

    const product = await Product.create({
        name,
        category,
        description,
        new_price : Number(new_price),
        old_price : Number(old_price),
        stock : Number(stock),
        main_image : product_main_image.url,
        extra_image : extra_image_arr,
        seller : req.seller?._id,
    })

    const createdProduct = await Product.findById(product._id).select().lean();

    if(!createdProduct){
        throw new ApiError(500, "something went wrong on client side");
    }
    return res.status(201).json(
        new ApiResponse(200,createdProduct,"success")
    )
})

export {
    registerProduct
}