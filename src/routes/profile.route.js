

import express from "express"
const prodfileRouter = express.Router();
import { userAuth } from "../utils/validation.js"

prodfileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.json({ user: user });
    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})


export default prodfileRouter;