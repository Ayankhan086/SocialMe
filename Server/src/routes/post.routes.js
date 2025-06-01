import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    togglePublishStatus
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/")
    .get(getAllPosts) // Get all posts
    .post(
        verifyJWT,
        upload.fields([
            { name: "video", maxCount: 1 },
            { name: "image", maxCount: 1 }
        ]),
        createPost
    ); // Create new post
   


router.route("/:postId")
    .get(getPostById) // Get post by ID
    .patch(verifyJWT, upload.single("image"), updatePost) // Update post
    .delete(verifyJWT, deletePost); // Delete post

router.route("/toggle-publish/:postId")
    .patch(verifyJWT, togglePublishStatus); // Toggle publish status

export default router;