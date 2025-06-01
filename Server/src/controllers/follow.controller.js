import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Follow } from "../models/follow.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


// TODO: toggle follow
const toggleFollow = asyncHandler(async (req, res) => {

    const { userId } = req.params
    const followerId = req.user?._id

    const existingFollow = await Follow.find({
        following: userId,
        follower: followerId
    })

    console.log(existingFollow);


    if (existingFollow.length > 0) {
        const unfollowUser = await Follow.findByIdAndDelete(existingFollow?._id)
        // Update counts
        await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
        return res.status(200).json(new ApiResponse(200, unfollowUser, "Unfollowed successfully"));
    }

    const newFollow = await Follow.create({
        follower: followerId,
        following: userId
    })

    // Update follower/following counts (optimistic update)
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

    return res.status(200).json(
        new ApiResponse(200, newFollow, "User is being followed successfully")
    )


})

// controller to return follower list of a user
const getUserFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const currentUserId = req.user?._id

    const followers = await Follow.find({ following: userId })

    return res.status(200).json(
        new ApiResponse(200, followers, "Subscribers list is fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getUserFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const currentUserId = req.user?._id

    const following = await Follow.find({ follower: userId })

    return res.status(200).json(
        new ApiResponse(200, following, "Following list is fetched successfully")
    )
})

const followList = asyncHandler(async (req, res) => {

    const user_id = req.user?._id

    const followedUsers = await Follow.find({
        follower: user_id
    }).select("following")

    const followedUserIds = followedUsers.map(follow => follow.following)
    console.log(followedUserIds);

    return res.status(200).json(
        new ApiResponse(200, followedUserIds, "Followed users fetched successfully")
    )
    
})    

export {
    toggleFollow,
    getUserFollowers,
    getUserFollowing,
    followList
}