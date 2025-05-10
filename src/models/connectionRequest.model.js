import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not a valid status"
        }
    }
}, { timestamps: true });



connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

connectionRequestSchema.index({ fromUserId: 1 })

export default ConnectionRequest;
