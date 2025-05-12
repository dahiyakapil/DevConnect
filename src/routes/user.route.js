import express from "express"
import { userAuth } from "../middlewares/userAuthMiddleware.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.models.js"

const userRouter = express.Router();


userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"])

        res.json({
            message: "Data Fetched Succesfully",
            data: connectionRequests
        })
    } catch (error) {
        req.statusCode(400).json({ message: "Error: " + error.message })
    }
})

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"])

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");


        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [{ _id: { $nin: Array.from(hideUserFromFeed) } },
            { _id: { $ne: loggedInUser._id } }
            ],

        }).select("firstName lasstName photoUrl skills").skip(skip).limit(limit)

        res.send(users)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default userRouter;