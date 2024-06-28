import mongoose from "mongoose";
const { Schema } = mongoose;


const commentSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true,
        trim: true
    },

    commentBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        required: true,
    },
    likes: {
        type: Number,
        default: 0
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

const commentModel = mongoose.model("comment", commentSchema);


export default commentModel;