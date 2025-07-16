import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
const app = express()

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174','https://skyadmin.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended : true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser());

//import routes
import {AdminRouter} from "./routes/admin.route.js"
import { UserRouter } from "./routes/user.route.js"

app.use("/api/v1/users",AdminRouter);
app.use("/api/v2/users",UserRouter);


export default app