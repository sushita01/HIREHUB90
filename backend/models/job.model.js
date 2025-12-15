import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // Full-time, Part-time
    salary: { type: String },
    description: { type: String },
    requirements: [String],
    benefits: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
