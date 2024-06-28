
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
import imageModel from "../models/image.js"
import postModel from "../models/post.js";
import userModel from "../models/user.js";
import mongoose from 'mongoose';
import commentModel from "../models/comment.js";
import likeModel from "../models/like.js";


const send = services.setResponse;

class post {
    /**
     * This function for createPost
     * @param {*} req.body.description         
     * @returns id
     */
    static createPost = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            const post = new postModel({
                description: req.body.description,
                userId: req.user._id,
            });

            if (!req.files || Object.keys(req.files).length === 0) {
                return send(
                    res,
                    statusCode.REQUIRED_CODE,
                    message.POST_IS_REQUIRED,
                    null
                );
            }

            let saveImage = services.imageUploader(req.files.image, post._id, req.user._id, "Post");

            const productData = await post.save();
            await imageModel.insertMany(saveImage);

            return send(res, statusCode.SUCCESSFUL, message.POST_CREATED_SUCCESSFULLY, {
                _id: productData._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };

    /**
   * This function for updatePost
   * @param {*} req.body.description
   * @param {*} req.body.userId  
   * @param {*} req.body.postId     
   * @returns id
   */
    static updatePost = async (req, res, next) => {
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

            checkPost.description = req.body.description ? req.body.description : checkPost.description;
            const postData = await checkPost.save();

            return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_UPDATED, {
                _id: postData._id,
            });
        } catch (error) {
            console.log('error.message :>> ', error.message);
            next(error);
        }
    };

    /**
   * This function for deletePost   
   * @param {*} req.body.postId     
   * @returns null
   */
    static deletePost = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }

            let checkPost = await postModel.findOne({
                _id: req.body.postId,
                isDeleted: false,
            });

            if (!checkPost) {
                return send(
                    res,
                    statusCode.NOT_ACCEPTABLE,
                    message.POST_NOT_FOUND,
                    null
                );
            }

            checkPost.isDeleted = true;

            const checkImage = await imageModel.findOne({
                postId: req.body.postId,
                isDeleted: false,
            });
            checkImage.isDeleted = true;

            await checkImage.save();
            await checkPost.save();

            return send(res, statusCode.SUCCESSFUL, message.POST_DELETED_SUCCESSFULLY, null);
        } catch (error) {
            next(error);
        }
    };


    /**
  * This function for postList   
  * @param {*} req.user._id     
  * @returns postData
  */
    static postListByUserId = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }
            const postList = await userModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'posts'
                    }
                },
                {
                    $lookup: {
                        from: 'images',
                        localField: 'posts._id',
                        foreignField: 'postId',
                        as: 'postImage'
                    }
                },
                {
                    $lookup: {
                        from: 'images',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'profileImage'
                    }
                },
                {
                    $project: {
                        userName: 1,
                        name: 1,
                        bio: 1,
                        postImage: { $concat: [process.env.BASE_URL, { $arrayElemAt: ["$postImage.url", 0] }] },
                        postImageId: { $arrayElemAt: ["$postImage._id", 0] },
                        description: { $arrayElemAt: ["$posts.description", 0] },
                        profileImage: { $concat: [process.env.BASE_URL, { $arrayElemAt: ["$profileImage.url", 0] }] }
                    }
                }
            ]);

            console.log(JSON.stringify(postList, null, 2));

            return send(
                res,
                statusCode.SUCCESSFUL,
                message.SUCCESSFUL,
                postList
            );
        } catch (error) {
            next(error);
        }
    };

    /**
* This function for commentListByPostId   
* @param {*} req.body.postId     
* @returns commentList
*/
    static commentListByPostId = async (req, res, next) => {
        console.log("inside clps")
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }
            const commentList = await commentModel.aggregate([
                {
                    $match: { postId: new mongoose.Types.ObjectId(req.body.postId) }
                },
                {
                    $lookup: {
                        from: "commentreplies",
                        let: {
                            id: '$_id'
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$commentId", "$$id",] },
                                    ]
                                }
                            },
                        }, {
                            $lookup: {
                                from: "users",
                                let: {
                                    id: '$replyBy'
                                },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$_id", "$$id",] },
                                            ]
                                        }
                                    },
                                }],
                                as: "userData"
                            }
                        }, {
                            $project: {
                                _id: 1,
                                likes: 1,
                                reply: 1,
                                userName: { $arrayElemAt: ['$userData.userName', 0] },
                            }
                        }],
                        as: "replyCommentData"
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'commentBy',
                        foreignField: '_id',
                        as: 'commentByUser'
                    }
                },
                {
                    $project: {
                        postId: 1,
                        comment: 1,
                        likes: 1,
                        userName: { $arrayElemAt: ['$commentByUser.userName', 0] },
                        replyCommentData: 1
                    }
                }
            ]);

            console.log(JSON.stringify(commentList, null, 2));

            return send(
                res,
                statusCode.SUCCESSFUL,
                message.SUCCESSFUL,
                commentList
            );
        } catch (error) {
            next(error);
        }
    };

    /**
* This function for getLikeList   
* @param {*} req.body.postId     
* @returns getLikeList
*/
    static getLikeList = async (req, res, next) => {
        try {
            if (services.hasValidatorErrors(req, res)) {
                return;
            }
            const likeList = await likeModel.aggregate([
                {
                    $match: { postId: new mongoose.Types.ObjectId(req.body.postId) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userData'
                    }
                },
                {
                    $project: {
                        postId: 1,
                        likeBy: 1,
                        bio: 1,
                        userName: { $arrayElemAt: ["$userData.userName", 0] },

                    }
                }
            ]);

            console.log(JSON.stringify(likeList, null, 2));

            return send(
                res,
                statusCode.SUCCESSFUL,
                message.SUCCESSFUL,
                { likeData: likeList, likeCount: likeList.length }
            );
        } catch (error) {
            next(error);
        }
    };


}

export default post;
