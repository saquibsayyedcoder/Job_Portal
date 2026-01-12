import express from "express";
import Resume from "../models/resumeSchema.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { createResume, deleteResume, getResumeByUser, updateResume } from "../controllers/resumeController.js";

const router = express.Router();

// Resume CRUD
router.post("/create", createResume);
router.get("/:userId", getResumeByUser);
router.put("/update/:userId", updateResume);
router.delete("/:id", deleteResume);

export default router;
