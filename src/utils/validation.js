import validator from "validator"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

export const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
        throw new Error("First Name is required")
    } else if(firstName.length<4 || firstName.length>50) {
        throw new Error("First Name length should be between 4 to 50")
    }
     else if (!validator.isEmail(email)) {
        throw new Error("EMail is not valid");
    }
}

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

export const validateProfileEditData = (req) => {
    try {
        // Allowed fields for editing (No password here!)
        const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"];

        // Check if ALL fields are in allowedEditFields
        const isEditAllowed = Object.keys(req.body).every((field) =>
            allowedEditFields.includes(field)
        );

        return isEditAllowed;
    } catch (error) {
        console.error("Validation Error: ", error.message);
    }
};
