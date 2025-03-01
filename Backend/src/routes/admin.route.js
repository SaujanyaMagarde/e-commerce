import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { registerProduct } from "../controllers/addproduct.js";
import { getallProduct, getCurrentSeller, getOrder, loginSeller, logoutSeller, refreshAccessToken, registerSeller, removeProduct, updatePass } from "../controllers/seller.controllers.js/auth.seller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const AdminRouter = Router();

AdminRouter.route("/product-registeration").post(
    verifyJWT,
    upload.fields([
        {
            name : "main_image",
            maxCount:1
        },{
            name : "extra_image",
            maxCount:5
        }
    ]),registerProduct)


AdminRouter.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1
        }
    ]),registerSeller
)

AdminRouter.route("/seller-login").post(loginSeller);

AdminRouter.route("/seller-logout").post(verifyJWT,logoutSeller);


AdminRouter.route("/seller-update-password").post(verifyJWT,updatePass);

AdminRouter.route("/seller-getHistory").post(verifyJWT,getOrder);

AdminRouter.route("/seller-removeProducts").post(verifyJWT,removeProduct);
AdminRouter.route("/seller-refreshAccesstoken").post(verifyJWT,refreshAccessToken)
AdminRouter.route("/seller-getallProducts").post(verifyJWT,getallProduct);
AdminRouter.route("/seller-getdetails").get(verifyJWT,getCurrentSeller)

export {AdminRouter};