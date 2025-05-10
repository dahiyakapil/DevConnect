import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, "Email is required"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address" + value)
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        validate: {
            validator: function (value) {
                return (
                    value.length >= 8 &&
                    /[A-Z]/.test(value) &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[!@#$%^&*]/.test(value)
                );
            },
            message:
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        },
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`
        },
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender data is not valid")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://w0.peakpx.com/wallpaper/16/683/HD-wallpaper-elon-musk-love-sayings-saying-feelings-unique-attitude.jpg",
        trim: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL -> " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });


userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DevConenect@123", { expiresIn: '1d' });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {

    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;

}


export default mongoose.model("User", userSchema)
