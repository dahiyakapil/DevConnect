import express from "express"
const authRouter = express.Router();

import { validateSignupData } from "../utils/validation.js";
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js";


authRouter.post("/signup", async (req, res) => {

    try {

        // Validation of data
        validateSignupData(req);

        // Encrypt the password
        const { firstName, lastName, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10); // returns a promise


        const user = new User({ firstName, lastName, email, password: passwordHash });
        // const {firstName , lastName, email, password} = req.body;


        await user.save();
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        res.status(404).send("Error in creating the user: " + error.message)
    }
})

authRouter.post("/login", async (req, res) => {
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

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            // Create a JWT Token
            const token = await user.getJWT();


            // Add the token to the cookie and send the response back to the user means the user is allready authenticated JWT is a tempoaray password
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
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

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Successfully")
})

export default authRouter;