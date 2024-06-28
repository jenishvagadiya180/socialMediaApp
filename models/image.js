import mongoose from "mongoose";
const { Schema } = mongoose;


const imageSchema = new mongoose.Schema({

    url: {
        type: String,
        required: true,
        trim: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    postId: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        trim: true
    },
    type: {
        type: String,
        enum: ["Post", "Profile"],
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

const imageModel = mongoose.model("image", imageSchema);


export default imageModel;