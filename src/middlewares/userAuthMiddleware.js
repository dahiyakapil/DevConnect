import jwt from "jsonwebtoken"
import User from "../models/user.models.js"


export const userAuth = async(req, res, next) => {
   try {
     const {token} = req.cookies;
 
     if(!token) {
         throw new Error("Token is not valid !!!");
     }
 
     const decodedData = jwt.verify(token, "DevConenect@123");
 
     const {_id} = decodedData;
 
     const user = await User.findById(_id);
 
     if(!user) {
         throw new Error("User not found")
     }
     req.user = user;

     next();

   } catch (error) {
    res.status(400).send("Error: " + error.message)
   }
}