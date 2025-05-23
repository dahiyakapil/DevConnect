// import jwt from "jsonwebtoken"
// import User from "../models/user.models.js"


// export const userAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       res.status(401).send("Please Login")
//     }

//     const decodedData = jwt.verify(token, "DevConenect@123");

//     const { _id } = decodedData;

//     const user = await User.findById(_id);

//     if (!user) {
//       throw new Error("User not found")
//     }
//     req.user = user;

//     next();

//   } catch (error) {
//     res.status(400).send("Error: " + error.message)
//   }
// }


import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login"); 
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found"); 
    }

    req.user = user;
    next(); 

  } catch (error) {
    return res.status(400).send("Error: " + error.message); 
  }
};
