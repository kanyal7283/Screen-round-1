const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const CommentModel = require("../model/comment-model");
const UserModel = require("../model/user-model");
const CommentReplyModel = require("../model/reply-comment-model");
module.exports = {
    addComment: async (req, res) => {
        try {
            //validation for user exist
            let userExist = await UserModel.findOne({ _id: req.body.userId });
            if (!userExist) return res.status(400).send({ code: 400, success: false, error: false, message: "User does not exist!" });

            //create new comment
            let comment = await CommentModel.create(req.body);

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Comment added successfully",
                data: comment
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },

    updateComment: async (req, res) => {
        try {
            req.body['commentDate'] = new Date();
            //create new comment
            let comment = await CommentModel.findOneAndUpdate({ _id: req.body.commentId }, { $set: req.body }, { new: true });
            if (!comment) return res.status(400).send({ code: 400, success: false, error: false, message: "Comment does not exist, please provide valid comment id!" });

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Comment updated successfully",
                data: comment
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },

    //delete comment 
    deleteComment: async (req, res) => {
        try {
            //create new comment
            let comment = await CommentModel.findOne({ _id: req.body.commentId });
            if (!comment) return res.status(400).send({ code: 400, success: false, error: false, message: "Comment does not exist, please provide valid comment id!" });

            await CommentModel.findByIdAndDelete(req.body.commentId);
            await CommentReplyModel.deleteMany({ commentId: req.body.commentId });

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Comment deleted successfully"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },


    //add new reply on comment
    addReply: async (req, res) => {
        try {
            //validation for user exist
            let userExist = await UserModel.findOne({ _id: req.body.userId });
            if (!userExist) return res.status(400).send({ code: 400, success: false, error: false, message: "User does not exist!" });

            //validation for  exist
            let commentExist = await CommentModel.findOne({ _id: req.body.commentId });
            if (!commentExist) return res.status(400).send({ code: 400, success: false, error: false, message: "Comment does not exist, please provide valid comment id!" });


            //create reply of comment
            let comment = await CommentReplyModel.create(req.body);

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Replied added on comment successfully",
                data: comment
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },

    //update the existing comment reply
    updateReply: async (req, res) => {
        try {
            req.body['commentDate'] = new Date();
            //create new comment
            let commentReply = await CommentReplyModel.findOneAndUpdate({ _id: req.body.replyId }, { $set: req.body }, { new: true });
            if (!commentReply) return res.status(400).send({ code: 400, success: false, error: false, message: "Comment reply does not exist, please provide valid comment reply id!" });

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Comment reply updated successfully",
                data: commentReply
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },

    //delete comment reply 
    deleteCommentReply: async (req, res) => {
        try {
            //validation
            let commentReply = await CommentReplyModel.findOne({ _id: req.body.replyId });
            if (!commentReply) return res.status(400).send({ code: 400, success: false, error: false, message: "Comment reply does not exist, please provide valid comment reply id!" });

            await CommentReplyModel.findByIdAndDelete(req.body.replyId);

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Comment reply deleted successfully"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },

    //list comments
    listComment: async (req, res) => {
        try {
            let { page = 1, limit = 10, search = "" } = req.query;

            const skipIndex = (page - 1) * limit;
            limit = parseInt(limit);
            page = parseInt(page);

            let params = {};

            // search 
            if (search != "") {
                params = Object.assign(params, {
                    text: { $regex: ".*" + search + ".*", $options: "i" },
                });
            }

            //filter on the basis of particular user
            if (req.body?.userId) {
                params = Object.assign(params, { userId: new ObjectId(req.body.userId) })

            }

            console.log(params);
            //list
            let commentList = await CommentModel.aggregate([
                { $match: params },
                {
                    $lookup:
                    {
                        from: "users",
                        let: { userId: "$userId" },
                        pipeline: [{ $match: { $expr: { $eq: ["$$userId", "$_id"] } } },
                        { $project: { name: 1, email: 1, _id: 0 } }

                        ],
                        as: "userDetails"
                    }
                },
                { $unwind: "$userDetails" },
                {
                    $lookup:
                    {
                        from: "comment_replies",
                        let: { commentId: "$_id" },
                        pipeline: [{ $match: { $expr: { $eq: ["$$commentId", "$commentId"] } } },
                        {
                            $lookup:
                            {
                                from: "users",
                                let: { userId: "$userId" },
                                pipeline: [{ $match: { $expr: { $eq: ["$$userId", "$_id"] } } },
                                { $project: { name: 1, email: 1, _id: 0 } }
                                ],
                                as: "userDetails"
                            }
                        },
                        { $unwind: "$userDetails" },
                        { $project: { text: 1, userDetails: 1, commentDate: 1 } },
                        { $sort: { "commentDate": 1 } },
                        ],
                        as: "replyCommentDetails"
                    }
                },
                {
                    $facet: {
                        list: [
                            { $project: { comment: 1, userDetails: 1, replyCommentDetails: 1, commentDate: 1, text: 1 } },
                            { $sort: { "commentDate": 1 } },
                            { $skip: skipIndex },
                            { $limit: limit }
                        ],
                        count: [
                            { $count: "total" }
                        ]
                    }
                }

            ]);

            let total = 0
            let [{ list = [] }] = commentList;
            if (commentList.length != 0) {
                if (commentList[0]['count'].length != 0)
                    total = commentList[0]['count'][0]['total'];
            }
            console.log(total,"total")

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Comment list fetched successfully",
                data: { list,total }
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    },




}