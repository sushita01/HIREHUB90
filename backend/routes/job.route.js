import express from "express";
import { createJob, getRecruiterJobs, getAllJobs, getJobById, updateJob, deleteJob} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/", createJob); // Recruiter creates a job
router.get("/recruiter/:recruiterId", getRecruiterJobs); // Fetch recruiter’s jobs
// routes/job.route.js
router.get("/", getAllJobs); // GET all jobs for applicants
router.get("/:id", getJobById);
router.put("/:id", updateJob);     // Edit job
router.delete("/:id", deleteJob);  // Delete job
export default router;
