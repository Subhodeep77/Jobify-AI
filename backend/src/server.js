import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

// 🔹 Routes
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import chatRoutes from "./routes/chat.routes.js"; // ✅ FIXED

// 🔹 Middleware
import errorMiddleware from "./middlewares/error.middleware.js"; // ✅ FIXED


connectDB();

const app = express();

// 🔹 Core middleware
app.use(cors());
app.use(express.json());

// 🔹 Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("API running");
});

// 🔹 Error handler (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});