import express from "express"
const requestRouter = express.Router()
import { userAuth } from "../middlewares/userAuthMiddleware.js"
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.models.js";

import { sendEmail } from "../utils/SendEmail/sendEmail.js"

requestRouter.post(
    "/send/:status/:toUserId", userAuth, async (req, res, next) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;


            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid status type: " + status })
            }



            const toUser = await User.findOne({ _id: toUserId });

            if (!toUser) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });

            if (existingConnectionRequest) {
                return res.status(400).json({ message: "Connection request already exists" })
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            })

            const data = await connectionRequest.save();

            const emailRes = await sendEmail(
                "kapildahiya308@gmail.com", // receiver (replace with `toUser.email` if available)
                "kapil@devconnect.biz",     // sender
                "New Connection Request on DevConnect",
                `<h1>DevConnect Invitation</h1><p>You have a new connection request on DevConnect. Log in to respond.</p>`,
                "You have a new connection request on DevConnect."
            );



            res.json({
                message: `You have successfully marked the user as "${status}"`,
                data
            })
        } catch (error) {
            next(error)
        }
    }
)

requestRouter.post("/review/:status/:requestId", userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const { status, requestId } = req.params;

            const allowedStatus = ["accepted", "rejected"]

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Status not allowed" });
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested"
            })

            if (!connectionRequest) {
                return res.status(400).json({ message: "Connection request not found" })
            }

            connectionRequest.status = status;

            const data = await connectionRequest.save();

            res.json({ message: "Connection request" + status, data });


        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
)



export default requestRouter;
