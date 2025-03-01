import { asyncHandler } from "../utils/AsyncHandels.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.js"


export const verifyJWTUser = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

        if(!token){
            throw new ApiError(401,"unothorised request")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError("401","invalid access token")
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})