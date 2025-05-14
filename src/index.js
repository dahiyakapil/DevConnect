import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express";
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser"

const app = express();
const PORT = 4000;

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))


import authRouter from "./routes/auth.route.js"
import profileRouter from "./routes/profile.route.js"
import requestRouter from "./routes/request.route.js"
import userRouter from "./routes/user.route.js";


app.use("/health-check", (req, res) => {
    res.send("Dev Connect Backend is running....")
})

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

