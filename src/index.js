import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { connectDB } from "./config/connectDB.js";
import User from "./models/user.models.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Kapil",
        lastName: "Dahiya",
        email: "kap@gmail.com",
        password: "ekrnfefkeel",
        age: 24,
        gender: "male"
    })

    try {
        await user.save();
        res.send("User created succefully")
    } catch (error) {
        res.status(404).send("Error in creating the user")
    }
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.log("MONGO db Connection failed !!!", error)
    })

