import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";

const router = express.Router();

// 🔹 Multer config
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"), false);
    }
    cb(null, true);
  }
});

// 🔹 Upload resume (protected route)
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

export default router;