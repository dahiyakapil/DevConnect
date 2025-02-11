import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;


//^ Route Parameters

// http://localhost:4000/user/abc
app.get("/user/:userId", (req, res) => {
    console.log(req.params) // { userId: 'abc' }
    console.log(req.params.userId) // abc
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" })
})

//* :id is a route parameter, which acts as a placeholder.

// Multiple Route Parameters

// http://localhost:4000/user/abcd/books/5
app.get("/user/:userId/books/:bookId", (req, res) => {
    console.log(req.params); // { userId: 'abc', bookId: '5' }
    console.log(req.params.userId) // abcd
    console.log(req.params.bookId) // 5
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" })
})

app.get("/flight/:from-:to", (req, res) => {
    console.log(req.params); // { from: 'LAX', to: 'SFO' }
    res.send("Flight Data fetched")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})