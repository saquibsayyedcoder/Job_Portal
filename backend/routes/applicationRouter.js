import express from "express";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.js";
import { deleteApplication, recruiterGetAllApplication, jobSeekerGetAllApplication, postApplication, selectResume, rejectResume, updateFinalStatus, rescheduleInterview } from "../controllers/applicationController.js";
import {singleUpload} from '../middlewares/multler.js'


const router = express.Router();

router.post("/apply/:id", isAuthenticated, isAuthorized("Job Seeker"),singleUpload,postApplication);

router.get("/employer/getall", isAuthenticated, isAuthorized("Recruiter"), recruiterGetAllApplication);

router.put("/employeer/selectResume/:id",isAuthenticated,isAuthorized("Recruiter"),selectResume);
router.put("/employeer/rejectResume/:id",isAuthenticated,isAuthorized("Recruiter"),rejectResume);
router.put("/employeer/updateFinalStatus/:id",isAuthenticated,isAuthorized("Recruiter"),updateFinalStatus);

router.put("/employeer/rescheduleInterview/:id", isAuthenticated, isAuthorized("Recruiter"), rescheduleInterview);


router.get("/jobseeker/getall", isAuthenticated, isAuthorized("Job Seeker"), jobSeekerGetAllApplication);

router.delete("/delete/:id", isAuthenticated, deleteApplication);
export default router;

