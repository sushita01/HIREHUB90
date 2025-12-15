import express from "express";
import { applyJob, getMyApplications, updateApplicationStatus, deleteApplication, getApplicationsByJob } from "../controllers/application.controller.js";

const router = express.Router();

// Apply for a job
router.post("/", applyJob);

// Get all applications of a user
router.get("/user/:userId", getMyApplications);

// Update application status
router.patch("/:id", updateApplicationStatus);

// Delete an application
router.delete("/:id", deleteApplication);

// Get applicants for a specific job
router.get("/job/:jobId", getApplicationsByJob);

export default router;