import express from "express";
const router = express.Router();
import post from '../controllers/post.js';
import { body } from 'express-validator';
import message from "../helper/message.js";
import auth from "../helper/middleware.js";

router.post("/createPost", auth,
    [
        body("description").exists().isLength({ min: 2 }).withMessage(message.INVALID_DESCRIPTION),
        body('userId').isMongoId().withMessage(message.INVALID_USER_ID)
    ],
    post.createPost);

router.post("/updatePost", auth,
    [
        body("description").exists().isLength({ min: 2 }).withMessage(message.INVALID_DESCRIPTION)
    ],
    post.updatePost);

router.post("/deletePost", auth,
    [
        body('postId').isMongoId().withMessage(message.INVALID_POST_ID)
    ],
    post.deletePost);

router.get("/postListByUser", auth,
    post.postListByUserId);





export default router;