import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { connectDB } from "./config/connectDB.js";
import User from "./models/user.models.js";
import { ReturnDocument } from "mongodb";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())

app.post("/signup", async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)

    // it is same to the req.body as req.body will also be a object using express.json will read the json
    // const user = new User({
    //     firstName: "Kapil",
    //     lastName: "Dahiya",
    //     email: "kap@gmail.com",
    //     password: "ekrnfefkeel",
    // })

    try {
        await user.save();
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        res.status(404).send("Error in creating the user")
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
        const user = await User.findByIdAndUpdate(userId , data, { returnDocument: "after" });
        console.log(user)
        res.send("User Updated Successfully")
    } catch (error) {
        res.status(500).send("Something went wrong");
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

