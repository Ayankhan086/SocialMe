import { Router } from 'express';
import {
    getLikedPosts,
    toggleCommentLike,
    togglePostLike
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/p/:Id").post(togglePostLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/posts").get(getLikedPosts);

export default router