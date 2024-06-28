
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
import imageModel from "../models/image.js"
import postModel from "../models/post.js";
import userModel from "../models/user.js";
import mongoose from 'mongoose';


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
                    $unwind: {
                        path: '$posts',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: 'posts._id',
                        foreignField: 'postId',
                        as: 'posts.likes'
                    }
                },
                {
                    $unwind: {
                        path: '$posts.images',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'images',
                        localField: 'posts._id',
                        foreignField: 'postId',
                        as: 'posts.images'
                    }
                },
                {
                    $unwind: {
                        path: '$posts.images',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'posts._id',
                        foreignField: 'postId',
                        as: 'posts.comments'
                    }
                },
                {
                    $unwind: {
                        path: '$posts.comments',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'commentreplies',
                        localField: 'posts.comments._id',
                        foreignField: 'commentId',
                        as: 'posts.comments.commentReplies'
                    }
                },
                // {
                //     $group: {
                //         _id: {
                //             userId: '$_id',
                //             postId: '$posts._id',
                //             commentId: '$posts.comments._id'
                //         },
                //         userName: { $first: '$userName' },
                //         name: { $first: '$name' },
                //         email: { $first: '$email' },
                //         postImages: { $first: '$posts.images' },
                //         postComments: {
                //             $push: {
                //                 _id: '$posts.comments._id',
                //                 comment: '$posts.comments.comment',
                //                 commentReplies: '$posts.comments.commentReplies'
                //             }
                //         }
                //     }
                // },
                // {
                //     $group: {
                //         _id: '$_id.userId',
                //         userName: { $first: '$userName' },
                //         name: { $first: '$name' },
                //         email: { $first: '$email' },
                //         posts: {
                //             $push: {
                //                 _id: '$_id.postId',
                //                 images: '$postImages',
                //                 comments: '$postComments'
                //             }
                //         }
                //     }
                // },
                // {
                //     $project: {
                //         _id: 1,
                //         userName: 1,
                //         name: 1,
                //         email: 1,
                //         posts: 1
                //     }
                // }
            ]);

            console.log(JSON.stringify(postList, null, 2));

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


}

export default post;
