import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const sellerSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    avatar: {
        type: String, // Cloudinary URL
        required: true,
    },
    aadhaar_no: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    mobile_no:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    shop_address : {
        type : String,
        required : true,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

// Hash password before saving
sellerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Check if password is correct
sellerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Generate access token
sellerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate refresh token
sellerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Seller = mongoose.model("Seller", sellerSchema);
