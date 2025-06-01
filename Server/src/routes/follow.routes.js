import { Router } from 'express';
import {
    followList,
    toggleFollow,
} from "../controllers/follow.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/:userId")
    .post(toggleFollow);

router    
    .route("/getFollowList")
    .get(followList);

export default router