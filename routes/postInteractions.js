import express from "express";
const router = express.Router();
import postInteractions from '../controllers/postInteractions.js';
import { body } from 'express-validator';
import message from "../helper/message.js";
import auth from "../helper/middleware.js";

router.post("/likeOrDisLikePost", auth,
    [
        body('postId').isMongoId().withMessage(message.INVALID_POST_ID)
    ],
    postInteractions.likeOrDisLikePost);

router.post("/addCommentToPost", auth,
    [
        body("comment").exists().isLength({ min: 1 }).withMessage(message.INVALID_COMMENT),
        body('postId').isMongoId().withMessage(message.INVALID_POST_ID),

    ],
    postInteractions.addCommentToPost);

router.post("/updateComment", auth,
    [
        body('commentId').isMongoId().withMessage(message.INVALID_COMMENT_ID),
    ],
    postInteractions.updateComment);

router.post("/deleteComment", auth,
    [
        body('commentId').isMongoId().withMessage(message.INVALID_COMMENT_ID),
    ],
    postInteractions.deleteComment);

router.post("/createReplyComment", auth,
    [
        body('commentId').isMongoId().withMessage(message.INVALID_COMMENT_ID),
        body("reply").exists().isLength({ min: 1 }).withMessage(message.INVALID_COMMENT)
    ],
    postInteractions.createReplyComment);

router.post("/deleteReplyComment", auth,
    [
        body('replyCommentId').isMongoId().withMessage(message.INVALID_REPLY_COMMENT_ID),
    ],
    postInteractions.deleteReplyComment);

router.post("/updateReplyComment", auth,
    [
        body('replyCommentId').isMongoId().withMessage(message.INVALID_COMMENT_REPLY_ID),
        body("reply").exists().isLength({ min: 1 }).withMessage(message.INVALID_COMMENT)
    ],
    postInteractions.updateReplyComment);



export default router;