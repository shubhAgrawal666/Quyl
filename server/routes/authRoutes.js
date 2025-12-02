// /api/auth/...
import express from "express";
import {
  register,
  verifyEmail,
  resendOTP,
  login,
  logout,
  sendResetOtp,
  resetPassword,
  isAuthenticated
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import "dotenv/config";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

router.post("/login", login);
router.post("/logout", logout);

router.get("/is-auth", authMiddleware, isAuthenticated);

router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

export default router;
