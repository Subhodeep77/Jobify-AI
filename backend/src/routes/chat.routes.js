import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatStream, getChatHistory } from "../controllers/chat.controller.js";

const router = express.Router();

// 🔹 Chat streaming route (SSE)
router.post("/stream", authMiddleware, chatStream);

// 🔹 Get chat history route
router.get("/history", authMiddleware, getChatHistory);

export default router;