import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
console.log('hitting login api');
router.post("/login", loginUser);
console.log('login api hit successfully');
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;