import Application from "../models/application.model.js";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";

// CREATE: Apply for a job
export const applyJob = async (req, res) => {
  try {
    const { userId, jobId, jobTitle, company, location, type, salary } = req.body;

    if (!userId || !jobId || !jobTitle || !company) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "jobseeker") return res.status(403).json({ success: false, message: "Only job seekers can apply" });

    const existingApp = await Application.findOne({ user: userId, job: jobId });
    if (existingApp) return res.status(400).json({ success: false, message: "You have already applied for this job" });

    // Save fallback fields for proxy jobs
    const application = await Application.create({ 
      user: userId, 
      job: jobId, 
      jobTitle, 
      company, 
      location: location || "N/A",   // optional fallback
      type: type || "N/A",           // optional fallback
      salary: salary || "N/A"        // optional fallback
    });

    return res.status(201).json({ success: true, application });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// READ: Get all applications of a user
export const getMyApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const apps = await Application.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("job"); // <- Populate job info

    return res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE: Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Viewed", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    app.status = status;
    await app.save();

    return res.status(200).json({ success: true, application: app });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE: Delete an application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    await app.deleteOne();
    return res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET: Get applicants for a job
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("user", "fullname email"); // populate name & email

    // Optional: add proxy for privacy
    const displayApplications = applications.map(app => ({
      ...app.toObject(),
      user: {
        fullname: app.user.fullname || "Anonymous Applicant",
        email: app.user.email || "Hidden",
      }
    }));

    return res.status(200).json({ success: true, applications: displayApplications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};