import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;



//^ Route paths based on string patterns Advance Routing using wildcard characters dynamic and flexible routing


// in ? : abc, ac --> b is optional here
app.get("/ab?c", (req, res) => {
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" });
})

// abc, abbbbc, b is must ... abcc(not work)
app.get("/ab+c", (req, res) => {
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" });
})

// abcd, abKAPILcd 
app.get("/ab*cd", (req, res) => {
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" });
})


//^ Route paths based on regular expressions

// It will check if a is there in the url or not if not present then it will throw the error
// http://localhost:4000/mango
app.get(/a/, (req, res) => {
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" });
})


// in this url anything can come before fly.. but fly should be there then it will work.... and writing anything after fly1 it will throw error
// http://localhost:4000/bKAPILcdafly
app.get(/.*fly$/, (req, res) => {
    res.send({ "firstName": "Kapil", "lastName": "Dahiya" });
})


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})