import express from "express";

import {getUser, login, logout, register, updatePassword, updateProfile, forgotPassword, resetPassword} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // max 3 attempts per IP
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.post("/password/forgot",forgotPassword, forgotPasswordLimiter); // now sends via WhatsApp
router.put("/password/reset/:token", resetPassword);

export default router;
