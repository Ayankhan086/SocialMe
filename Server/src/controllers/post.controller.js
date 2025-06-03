import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new post
const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    let video, image; // <-- Use let, not const
    const owner = req.user?._id;

    if (!content && !req.files?.image && !req.files?.video) {
        throw new ApiError(400, "Description, image or video is required");
    }

    // Handle video upload if present
    if (req.files?.video) {
        const videoLocalPath = req.files.video[0]?.path;
        video = await uploadOnCloudinary(videoLocalPath);
        if (!video?.url) {
            throw new ApiError(400, "Error uploading video file");
        }
        console.log("Video uploaded successfully:", video.url);
    }

    // Handle image upload if present
    if (req.files?.image) {
        const imageLocalPath = req.files.image[0]?.path;
        image = await uploadOnCloudinary(imageLocalPath);
        if (!image?.url) {
            throw new ApiError(400, "Error uploading image");
        }
        console.log("Image uploaded successfully:", image.url);
    }

    const post = await Post.create({
        videoFile: video?.url,
        image: image?.url,
        description: content,
        isPublished: true, // Default to published
        duration: video?.duration,
        owner
    });

    return res.status(201).json(
        new ApiResponse(201, post, "Post created successfully")
    );
});

// Get all posts with pagination
const getAllPosts = asyncHandler(async (req, res) => {
    let { userId } = req.query;

    let query = {  };
    if (userId) {
        query.owner = userId;
    }

    const posts = await Post.aggregate([
        { $match: query },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "Post",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"
            }
        },
        {
            $addFields: {
                commentsCount: { $size: "$comments" }
            }
        },
        {
            $project: {
                _id: 1,
                description: 1,
                image: 1,
                videoFile: 1,
                duration: 1,
                isPublished: 1,
                views: 1,
                likesCount: 1,
                commentsCount: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    avatar: "$owner.avatar"
                },
                createdAt: 1
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, posts, "Posts fetched successfully")
    );
});

// Get post by ID
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId).populate("owner", "username avatar");

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Increment view count
    post.views += 1;
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Post fetched successfully")
    );
});

// Update post
const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { description } = req.body;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this post");
    }

    let image;
    if (req.file?.image) {
        const imageLocalPath = req.file.image[0]?.path;
        image = await uploadOnCloudinary(imageLocalPath);
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                description,
                image: image?.url || post.image
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Post updated successfully")
    );
});

// Delete post
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this post");
    }

    await Post.findByIdAndDelete(postId);

    // TODO: Delete media files from Cloudinary

    return res.status(200).json(
        new ApiResponse(200, {}, "Post deleted successfully")
    );
});

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this post");
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                isPublished: !post.isPublished
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Publish status toggled successfully")
    );
});


export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    togglePublishStatus
};