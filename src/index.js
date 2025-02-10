import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;


app.use("/", (req, res) => {
    res.send("Hello from DEV CONNECT");
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})