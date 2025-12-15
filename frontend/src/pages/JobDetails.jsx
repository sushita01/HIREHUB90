import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jobs as mockJobs } from "../data/jobs";
import api from "../context/api";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Try fetching from backend
        const { data } = await api.get(`/v1/jobs/${id}`);
        if (data.success) {
          setJob(data.job);
        } else {
          // fallback to mock jobs
          const foundJob = mockJobs.find(j => j.id === id);
          setJob(foundJob || null);
        }
      } catch (err) {
        const foundJob = mockJobs.find(j => j.id === id);
        setJob(foundJob || null);
        console.log("Failed to fetch job:", err.message);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) return <div className="p-6">Job not found.</div>;

  // Helper to generate a valid MongoDB ObjectId for proxy jobs
  const generateObjectId = () => {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    );
  };

  const applyNow = async () => {
    if (!user) {
      setMessage("Please login first to apply.");
      return;
    }

    try {
      // Use backend _id if available, otherwise generate valid ObjectId for proxy jobs
      const jobId = job._id || generateObjectId();

      const { data } = await api.post("/v1/applications", {
        userId: user._id,
        jobId,
        jobTitle: job.title,
        company: job.company,
      });

      setMessage(data.message || (data.success ? "Application submitted!" : "Application failed."));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-gray-600 mt-2">{job.company} · {job.location || "N/A"}</p>
        <p className="text-gray-600 mt-1">{job.type || "N/A"} · {job.salary || "N/A"}</p>

        {job.description && <p className="mt-4 text-gray-700"><b>Description:</b> {job.description}</p>}
        {job.requirements && <p className="mt-2 text-gray-700"><b>Requirements:</b> {Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements}</p>}
        {job.benefits && <p className="mt-2 text-gray-700"><b>Benefits:</b> {Array.isArray(job.benefits) ? job.benefits.join(", ") : job.benefits}</p>}
        {job.postedDate && <p className="text-gray-500 mt-1">Posted on: {job.postedDate}</p>}

        <div className="mt-6 flex gap-3 flex-wrap">
          <button
            onClick={applyNow}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Now
          </button>
          {message && <div className="text-sm text-gray-800 self-center">{message}</div>}
        </div>

        <div className="mt-4">
          <Link to="/search" className="text-blue-600 hover:underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}