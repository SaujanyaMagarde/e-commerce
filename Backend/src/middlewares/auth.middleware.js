import { asyncHandler } from "../utils/AsyncHandels.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { Seller } from "../models/seller.js"


export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unothorised seller request to seller",token)
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const seller = await Seller.findById(decodedToken?._id).select("-password -refreshToken")
        if(!seller){
            throw new ApiError("401","invalid access token")
        }
        req.seller = seller;
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "invalid access token")
    }
})