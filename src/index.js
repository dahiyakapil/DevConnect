import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;


//^ Middlewares and Error Handlers

//& Route Handlers

app.use("/user", (req, res, next) => {
    console.log("Route Handler -> 1")
    next();
    // res.send("Response 1")

}, (req, res, next) => {
    console.log("Route Handler -> 2")
    res.send("Response 2")
    next();
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})