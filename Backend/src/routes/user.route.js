import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWTUser } from "../middlewares/userauth.middleware.js";
import { addToCart, getallProduct, getCart, getCurrentUser, getUserOrders, loginUser, logoutUser, placeOrder, registerUser, removeFromCart, reviwes } from "../controllers/user.controller.js/auth.user.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

UserRouter.post("/user-create-checkout-session", verifyJWTUser, async (req, res) => {
  console.log("1");
  try {
    const { items } = req.body;

    console.log(items);

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr", // use INR if you want rupee
        product_data: {
          name: item.product.name,
          images: [item.product.main_image], // optional: show product image on Stripe
        },
        unit_amount: item.price * 100, // Stripe expects paise if INR, cents if USD
      },
      quantity: item.quantity,
    }));

    console.log(line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log("4");

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});


export {UserRouter};