import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    bio: {
        type: String,
        required: true,
        trim: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    createdAt: Number,
    updatedAt: Number

},

    { timestamps: true });

const userModel = mongoose.model("user", userSchema)


export default userModel;
