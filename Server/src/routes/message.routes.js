import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/users", verifyJWT, getUsersForSidebar)
router.get("/:id", verifyJWT, getMessages)
router.post("/send/:id", verifyJWT, upload.single('image'), sendMessage)

export default router;