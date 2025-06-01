import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content }  = req.body

    if(!content) {
        throw new ApiError(401, "Tweet's Content is required")
    }
    
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if(!tweet) {
        throw new ApiError(400, "Something went wrong while creatinf tweet")
    }

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet is successfully created")
    )
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    const user = await User.findById(userId)

    if(!user) {
        throw new ApiError(402, "User does not exist")
    }

    const tweets = await Tweet.find({
        owner: userId
    })

    if(!tweets) {
        throw new ApiError(401, "No tweets found")
    }

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets are fetched successfully.")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body

    if(!content ) {
        throw new ApiError(401, "Content required for updation")
    }

    if(!tweetId) {
        throw new ApiError(401, "Tweet Id required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if(!tweet) {
        throw new ApiError(402, "Tweet does not exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params

    if(!tweetId) {
        throw new ApiError(401, "Tweet Id required")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(
        new ApiResponse(200, "Tweet is deleted")
    )


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
