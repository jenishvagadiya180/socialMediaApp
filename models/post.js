import mongoose from "mongoose";
const { Schema } = mongoose;


const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
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

const postModel = mongoose.model("post", postSchema);


export default postModel;