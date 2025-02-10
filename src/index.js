import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use("/hello/123", (req, res) => {
    res.send("Hello from /hello/123")
})

app.use("/hello", (req, res) => {
    res.send("Hello from /hello")
})

app.use("/xyz", (req, res) => {
    res.send("XYZ ROUTE")
})

app.use("/", (req, res) => {
    res.send("Hello from DEV CONNECT");
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})