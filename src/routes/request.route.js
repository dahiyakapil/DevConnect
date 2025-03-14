import express from "express"
const requestRouter = express.Router()
import {userAuth} from "../utils/validation.js"

requestRouter.post("/sendingConnectionRequest", userAuth, (req, res) => {

    const user = req.user;

    res.send(user.firstName + " sent the connection request");
})

export default requestRouter;
