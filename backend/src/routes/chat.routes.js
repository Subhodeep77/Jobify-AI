import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatStream } from "../controllers/chat.controller.js";

const router = express.Router();

// 🔹 Chat streaming route (SSE)
router.post("/stream", authMiddleware, chatStream);

export default router;