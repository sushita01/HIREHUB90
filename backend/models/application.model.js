// models/application.model.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobTitle: { type: String },   // store job title for proxy jobs
  company: { type: String },    // store company for proxy jobs
  location: { type: String },   // optional
  type: { type: String },       // optional
  salary: { type: String },     // optional
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);