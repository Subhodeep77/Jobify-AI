import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatStream, getChatHistory } from "../controllers/chat.controller.js";

const router = express.Router();


router.post("/stream", authMiddleware, chatStream);


router.get("/history", authMiddleware, getChatHistory);

export default router;