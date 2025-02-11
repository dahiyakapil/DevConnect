import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;



app.use("/user", (req, res) => {
    res.send("Route Order Matters !!!")
})

app.get("/user", (req, res) => {
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" });
})

app.post("/user", (req, res) => {
    res.send("User data saved to the databse successfully!")
})

app.delete("/user", (req, res) => {
    res.send("User data deleted successfully!")
})

app.put("/user", (req, res) => {
    res.send("User data updated Successfully !!!")
})



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})