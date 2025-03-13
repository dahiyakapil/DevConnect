import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { connectDB } from "./config/connectDB.js";
import User from "./models/user.models.js";
import { validateSignupData } from "./utils/validation.js";
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 4000;

// Third Party Middlewares
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {

    try {

        // Validation of data
        validateSignupData(req);

        // Encrypt the password
        const { firstName, lastName, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10); // returns a promise
        console.log(passwordHash)

        const user = new User({ firstName, lastName, email, password: passwordHash });
        // const {firstName , lastName, email, password} = req.body;


        await user.save();
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        res.status(404).send("Error in creating the user: " + error.message)
    }
})

// Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email using validator library
        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid")
        }

        // find the user using email
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            // Create a JWT Token
            const token = await jwt.sign({ _id: user._id }, "DevConenect@123");



            // Add the token to the cookie and send the response back to the user means the user is allready authenticated JWT is a tempoaray password
            res.cookie("token", token);
            res.json({
                message: "Logged in Successfully",
                user: user,
            });
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})

// Get API Call using cookies /profile
app.get("/profile", async (req, res) => {
try {
        const cookies = req.cookies;
    
        // Validate the token
        const { token } = cookies;
        if(!token) {
            throw new Error("Invalid Token")
        }
    
        const decodedMessage = await jwt.verify(token, "DevConenect@123");
        // console.log(decodedMessage);
    
        const { _id } = decodedMessage;
        // console.log("Logged in user: " + _id);
    
        // now fetch the user from the _id
        const user  = await User.findById({_id})

        if(!user) {
            throw new Error("User not found");
        }
        res.json({user: user});
} catch (error) {
    res.status(404).send("Error: " + error.message)
}
})

// find the user by email
app.get("/user", async (req, res) => {
    const user = req.body.email;
    console.log(user)

    try {
        const userFound = await User.find({ email: user })
        if (userFound.length === 0) {
            res.status(404).send("User not found");
        }
        res.send(userFound)
    } catch (error) {
        res.send("Something went wrong")
    }
})

// find all user /feed
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(404).send("Something went wrong")
    }
})

// Find user by _id
app.get("/user/:id", async (req, res) => {
    const userId = req.params.id; // Get _id from request params
    console.log(req.params)
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});


// Delete API
app.delete("/user", async (req, res) => {
    const userId = req.body;
    try {
        // const user = await User.findByIdAndDelete(userId);
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted Successfully");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})

app.delete("/user/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        // const user = await User.findByIdAndDelete(userId);
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted Successfully");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})


// Update API
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        console.log(user)
        res.send("User Updated Successfully")
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
app.patch("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    try {

        // API Level Validation
        const ALLOWED_UPDATES = ["photoUrl", "age", "gender", "skills"];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed");
        }

        // Minimum Skills validation
        if (data?.skills.length > 10) {
            throw new Error("Skills can not be more than 10")
        }


        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true });
        console.log(user)
        res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        res.status(500).send("Update API FAILED: " + error.message);
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

