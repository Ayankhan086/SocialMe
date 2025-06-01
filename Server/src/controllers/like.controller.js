import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Post} from "../models/post.model.js"

const togglePostLike = asyncHandler(async (req, res) => {
    const {Id} = req.params
    //TODO: toggle like on video

    console.log("Toggle like on post with ID:", Id);


    const post = await Post.findById(Id);

    if(!post) {
        throw new ApiError(404, "Post not found")
    }

    const LikeExists = await Like.findOne({
        Post: Id,
        likedBy: req.user._id
    })

    if( LikeExists) {
        // If like exists, remove it
        await Like.deleteOne({
            Post: Id,
            likedBy: req.user._id
        })
        return res.status(200).json(new ApiResponse("Like removed successfully"))
    }

    // If like does not exist, create it

    const newLike = await Like.create({
        Post: Id,
        likedBy: req.user._id
    })

    if (!newLike) {
        throw new ApiError(500, "Failed to like the post")
    }

    return res.status(201).json(new ApiResponse(201, newLike, "Post liked successfully"))


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedPosts = asyncHandler(async (req, res) => {
    const likedPosts = await Like.find({ likedBy: req.user._id }).populate("Post");
    res.status(200).json(new ApiResponse(200, likedPosts));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    togglePostLike,
    getLikedPosts
}