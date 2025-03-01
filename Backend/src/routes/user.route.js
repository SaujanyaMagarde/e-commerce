import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWTUser } from "../middlewares/userauth.middleware.js";
import { addToCart, getallProduct, getCart, getCurrentUser, getUserOrders, loginUser, logoutUser, placeOrder, registerUser, removeFromCart, reviwes } from "../controllers/user.controller.js/auth.user.js";
const UserRouter = Router();

UserRouter.route("/user-signup").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1
        }
    ]),registerUser)


UserRouter.route("/user-login").post(loginUser)
UserRouter.route("/user-logout").post(verifyJWTUser,logoutUser)
UserRouter.route("/user-orders-history").get(verifyJWTUser,getUserOrders)
UserRouter.route("/user-addTocart").post(verifyJWTUser,upload.none(),addToCart)
UserRouter.route("/user-placeorder").get(verifyJWTUser,placeOrder)

UserRouter.route("/user-removefromcart").post(verifyJWTUser,removeFromCart)
UserRouter.route("/user-allProduct").get(getallProduct);

UserRouter.route("/user-review").post(
    upload.fields([
        {
            name : "review_image",
            maxCount : 1
        }
    ]),verifyJWTUser,reviwes);

UserRouter.route("/user-getdetails").post(verifyJWTUser,getCurrentUser)

UserRouter.route("/user-getcart").get(verifyJWTUser,getCart)

export {UserRouter};