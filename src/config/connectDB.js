import mongoose from "mongoose"

export const connectDB = async () => {

    const str = "mongodb+srv://kapil:HMyG4pUAob5RSDew@devconnect.2ahsn.mongodb.net/?retryWrites=true&w=majority&appName=devConnect";
    console.log(str)
    try {
        const connectionInstance = await mongoose.connect(str);
        console.log(`MongoDB connected Succesfully || ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection FAILED", error)
    }
}
