import mongoose from "mongoose";
const { Schema } = mongoose;


const likeSchema = new mongoose.Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        required: true,
    },
    likeBy: {
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

const likeModel = mongoose.model("like", likeSchema);


export default likeModel;