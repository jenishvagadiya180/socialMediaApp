
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
import likeModel from "../models/like.js"
import postModel from "../models/post.js"
import commentModel from "../models/comment.js";
import commentReplyModel from "../models/commentReply.js"


const send = services.setResponse;

class postInteractions {

    /**
     * This function for likeOrDisLikePost
     * @param {*} req.body.postId
     * @param {*} req.body.userId       
     * @returns id
     */
    static likeOrDisLikePost = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            let checkPost = await postModel.findOne({
                _id: req.body.postId,
                isDeleted: false
            });

            if (!checkPost)
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.POST_NOT_FOUND,
                    null
                );

            if (req.body.isLike) {
                const post = new likeModel({
                    postId: req.body.postId,
                    likeBy: req.user._id
                });
                await post.save();
            } else {
                let checkLike = await likeModel.findOne({
                    likeBy: req.user._id,
                    postId: req.body.postId,
                    isDeleted: false,
                });

                checkLike.isDeleted = true
                await checkLike.save();
            }

            return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_UPDATED, {
                _id: checkPost._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };

    /**
       * This function for addCommentToPost
       * @param {*} req.body.postId
       * @param {*} req.body.userId       
       * @returns id
       */
    static addCommentToPost = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            let checkPost = await postModel.findOne({
                _id: req.body.postId,
                isDeleted: false,
            });

            if (!checkPost)
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.POST_NOT_FOUND,
                    null
                );

            const createComment = new commentModel({
                comment: req.body.comment,
                commentBy: req.user._id,
                postId: req.body.postId,
                likes: 0
            });
            await createComment.save();

            return send(res, statusCode.SUCCESSFUL, message.COMMENT_CREATED_SUCCESSFULLY, {
                _id: createComment._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };


    /**
   * This function for updateComment
   * @param {*} req.body.commentId
   * @param {*} req.body.userId        
   * @returns id
   */
    static updateComment = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            let checkComment = await commentModel.findOne({
                _id: req.body.commentId,
                isDeleted: false,
            });

            if (!checkComment)
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.COMMENT_NOT_FOUND,
                    null
                );

            checkComment.comment = req.body.comment ? req.body.comment : checkComment.comment

            if (req.body.isLike) {
                checkComment.likes = checkComment.likes + 1;
            }
            else if (req.body.disLike) {
                checkComment.likes = checkComment.likes - 1;
            }

            await checkComment.save();

            return send(res, statusCode.SUCCESSFUL, message.COMMENT_UPDATED_SUCCESSFULLY, {
                _id: checkComment._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };

    /**
   * This function for deleteComment
   * @param {*} req.body.commentId    
   * @returns id
   */
    static deleteComment = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            const checkComment = await commentModel.findOne({
                _id: req.body.commentId,
                isDeleted: false,
            });

            if (!checkComment) {
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.COMMENT_NOT_FOUND,
                    null
                );
            }
            checkComment.isDeleted = true;

            await commentReplyModel.updateMany({ commentId: req.body.commentId, isDeleted: false }, { isDeleted: true });
            await checkComment.save();

            return send(res, statusCode.SUCCESSFUL, message.COMMENT_DELETED_SUCCESSFULLY, null);
        } catch (error) {
            next(error);
        }
    };


    /**
     * This function for replyComment
     * @param {*} req.body.commentId
     * @param {*} req.body.reply          
     * @returns id
     */
    static createReplyComment = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            let checkComment = await commentModel.findOne({
                _id: req.body.commentId,
                isDeleted: false,
            });

            if (!checkComment)
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.COMMENT_NOT_FOUND,
                    null
                );

            const createCommentReply = new commentReplyModel({
                reply: req.body.reply,
                replyBy: req.user._id,
                commentId: req.body.commentId,
                likes: 0
            });
            await createCommentReply.save();

            return send(res, statusCode.SUCCESSFUL, message.COMMENT_REPLY_CREATED_SUCCESSFULLY, {
                _id: createCommentReply._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };

    /**
 * This function for updateReplyComment
 * @param {*} req.body.replyCommentId 
 * @param {*} req.body.reply
 * @returns id
 */
    static updateReplyComment = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            let checkCommentReply = await commentReplyModel.findOne({
                _id: req.body.replyCommentId,
                isDeleted: false,
            });

            if (!checkCommentReply)
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.COMMENT_REPLY_NOT_FOUND,
                    null
                );

            checkCommentReply.reply = req.body.reply ? req.body.reply : checkCommentReply.reply

            if (req.body.isLike) {
                checkCommentReply.likes = checkCommentReply.likes + 1;
            }
            else if (req.body.disLike) {
                checkCommentReply.likes = checkCommentReply.likes - 1;
            }
            await checkCommentReply.save();

            return send(res, statusCode.SUCCESSFUL, message.COMMENT_REPLY_UPDATED_SUCCESSFULLY, {
                _id: checkCommentReply._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };

    /**
  * This function for deleteReplyComment
  * @param {*} req.body.commentReplyId        
  * @returns id
  */
    static deleteReplyComment = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            const checkcommentReply = await commentReplyModel.findOne({
                _id: req.body.replyCommentId,
                isDeleted: false,
            });

            if (!checkcommentReply) {
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.COMMENT_REPLY_NOT_FOUND,
                    null
                );
            }

            checkcommentReply.isDeleted = true;
            await checkcommentReply.save();
            return send(res, statusCode.SUCCESSFUL, message.COMMENT_REPLY_DELETED_SUCCESSFULLY, null);
        } catch (error) {
            next(error);
        }
    };

}

export default postInteractions;
