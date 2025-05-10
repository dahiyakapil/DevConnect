import express from "express"
const requestRouter = express.Router()
import { userAuth } from "../utils/validation.js"
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.models.js";



requestRouter.post(
    "/send/:status/:toUserId", userAuth, async (req, res) => {
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

            res.json({
                message: `You have successfully marked the user as "${status}"`,
                data
            })
        } catch (error) {
            res.status(404).send("Error: " + error.message)
        }
    }
)



export default requestRouter;
