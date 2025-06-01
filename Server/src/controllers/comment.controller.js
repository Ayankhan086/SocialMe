import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getPostComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a post
    const {postId} = req.params
    console.log("Fetching comments for post:", postId);

    const comments = await Comment.aggregate([
        {
            $match: {post: new mongoose.Types.ObjectId(postId)}
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    profilePicture: "$owner.profilePicture"
                }
            }
        }
    ]).sort({createdAt: -1})

    if (!comments) {
        throw new ApiError(404, "No comments found for this post")
    }

    console.log("Comments fetched successfully:", comments);

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a post

    const {postId} = req.params
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        post: postId,
        content,
        owner: req.user.id
    })


    if (!comment) {
        throw new ApiError(500, "Failed to add comment")
    }

    res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getPostComments, 
    addComment, 
    updateComment,
     deleteComment
    }
