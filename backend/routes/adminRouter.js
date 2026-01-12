import express from "express";
import {
  getAllUsers,
  getAllJobs,
  getAllApplications,
} from "../controllers/adminController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { register, login } from "../controllers/userController.js";
const router = express.Router();
router.post("/adminRegister", register);
router.post("/login", login);
router.get("/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.get("/jobs", isAuthenticated, isAuthorized("Admin"), getAllJobs);
router.get(
  "/applications",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllApplications
);

export default router;
