import mongoose from "mongoose";
const { Schema } = mongoose;


const commentReplySchema = new mongoose.Schema({

    reply: {
        type: String,
        required: true,
        trim: true
    },

    replyBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "comments",
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

const commentReplyModel = mongoose.model("commentReply", commentReplySchema);


export default commentReplyModel;