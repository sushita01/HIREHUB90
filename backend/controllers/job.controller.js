import Job from "../models/job.model.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, salary, description, requirements, benefits } = req.body;
    const recruiterId = req.body.recruiter; // pass recruiter _id from frontend

    const job = await Job.create({
      recruiter: recruiterId,
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      benefits,
    });

    return res.status(201).json({ success: true, job });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all jobs posted by a recruiter
export const getRecruiterJobs = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const jobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// UPDATE job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};