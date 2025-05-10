import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json())
app.use(cookieParser())


import authRouter from "./routes/auth.route.js"
import profileRouter from "./routes/profile.route.js"
import requestRouter from "./routes/request.route.js"
import userRouter from "./routes/user.route.js";

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.log("MONGO db Connection failed !!!", error)
    })

