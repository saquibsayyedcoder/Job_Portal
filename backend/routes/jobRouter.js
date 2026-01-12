import express from "express";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.js";
import {postJob,getAllJobs, getMyJobs, deleteJob, getASingleJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("Recruiter"), postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Recruiter"), getMyJobs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Recruiter"), deleteJob);
router.get("/get/:id", getASingleJob);

export default router;