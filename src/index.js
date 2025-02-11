import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;


//^ Query Parameters

app.get("/user", (req, res) => {
    console.log(req.query) // { id: '10', age: '24' } http://localhost:4000/user?id=10&age=24
    res.send({ "firstName": "kapil", "lastName": "Dahiya" })
})

// Query Parameters with Arrays
app.get("/filter", (req, res) => {
    console.log(req.query) // { colors: [ 'red', 'blue' ] }
    res.send(`Colors: ${req.query.colors}`);
});


// Query Parameters in Pagination
app.get("/users", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console.log(req.query) // { page: '2', limit: '9' }
    res.send(`Page: ${page}, Limit: ${limit}`);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})