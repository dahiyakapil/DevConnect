

import express from "express"
const prodfileRouter = express.Router();
import {validateProfileEditData } from "../utils/validation.js"
import {userAuth} from "../middlewares/userAuthMiddleware.js"

prodfileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.json({ user: user });
    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})

prodfileRouter.post("/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData) {
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]
        })

        await loggedInUser.save();
        res.json({
            message: "User Updated Successfully",
            data: loggedInUser
        });


    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})


export default prodfileRouter;