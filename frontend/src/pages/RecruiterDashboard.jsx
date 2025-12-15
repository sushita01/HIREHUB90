import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../context/api";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const [msg, setMsg] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!user || user.role !== "recruiter") return;

    const fetchJobs = async () => {
      try {
        const { data } = await api.get(`/v1/jobs/recruiter/${user._id}`);
        if (data.success) setJobs(data.jobs);
      } catch (err) {
        console.log("Failed to fetch recruiter jobs:", err.message);
      }
    };

    fetchJobs();
  }, [user]);

  const deleteJob = async (jobId) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;
  try {
    const { data } = await api.delete(`/v1/jobs/${jobId}`);
    if (data.success) {
      setJobs(prev => prev.filter(j => j._id !== jobId));
      setMsg("Job deleted successfully");
      setTimeout(() => setMsg(""), 2000);
    }
  } catch (err) {
    setMsg("Failed to delete job");
  }
};


const startEdit = (job) => {
  setEditingJobId(job._id);
  setEditForm({
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    salary: job.salary,
  });
};
const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};
const saveEdit = async (jobId) => {
  try {
    const { data } = await api.put(`/v1/jobs/${jobId}`, editForm);
    if (data.success) {
      setJobs(prev =>
        prev.map(job => job._id === jobId ? data.job : job)
      );
      setEditingJobId(null);
      setMsg("Job updated successfully");
      setTimeout(() => setMsg(""), 2000);
    }
  } catch (err) {
    setMsg("Failed to update job");
  }
};
  const viewApplicants = async (jobId) => {
    try {
      const { data } = await api.get(`/v1/applications/job/${jobId}`);
      if (data.success) setApplicants(prev => ({ ...prev, [jobId]: data.applications }));
    } catch (err) {
      console.log("Failed to fetch applicants:", err.message);
    }
  };

  const updateStatus = async (jobId, appId, status) => {
    if (!window.confirm(`Mark this application as "${status}"?`)) return;
    try {
      const { data } = await api.patch(`/v1/applications/${appId}`, { status });
      if (data.success) {
        setApplicants(prev => ({
          ...prev,
          [jobId]: prev[jobId].map(app => app._id === appId ? data.application : app)
        }));
        setMsg(`Status updated to "${status}"`);
        setTimeout(() => setMsg(""), 2000);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update status");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const removeApplicant = async (jobId, appId) => {
    if (!window.confirm("Are you sure you want to delete this applicant?")) return;
    try {
      const { data } = await api.delete(`/v1/applications/${appId}`);
      if (data.success) {
        setApplicants(prev => ({
          ...prev,
          [jobId]: prev[jobId].filter(app => app._id !== appId)
        }));
        setMsg("Applicant removed successfully");
        setTimeout(() => setMsg(""), 2000);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to remove applicant");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Recruiter Dashboard</h1>
      {msg && <div className="text-green-600 mb-4">{msg}</div>}

      {jobs.length === 0 ? (
        <div className="text-gray-600">You haven’t posted any jobs yet.</div>
      ) : (
        jobs.map(job => (
          <div key={job._id} className="bg-white rounded-xl shadow p-5 mb-4">
            {editingJobId === job._id ? (
  <div className="space-y-2">
    <input
      name="title"
      value={editForm.title}
      onChange={handleEditChange}
      className="w-full p-2 border rounded"
    />
    <input
      name="company"
      value={editForm.company}
      onChange={handleEditChange}
      className="w-full p-2 border rounded"
    />
    <input
      name="location"
      value={editForm.location}
      onChange={handleEditChange}
      className="w-full p-2 border rounded"
    />
    <input
      name="salary"
      value={editForm.salary}
      onChange={handleEditChange}
      className="w-full p-2 border rounded"
    />

    <div className="flex gap-2">
      <button
        onClick={() => saveEdit(job._id)}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Save
      </button>
      <button
        onClick={() => setEditingJobId(null)}
        className="px-3 py-1 bg-gray-500 text-white rounded"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <>
    <h2 className="text-xl font-semibold">{job.title}</h2>
    <p className="text-gray-600">{job.company} · {job.location}</p>
    <p className="text-sm text-gray-500">{job.type} · {job.salary}</p>

    <div className="flex gap-2 mt-3">
      <button
        onClick={() => startEdit(job)}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        Edit
      </button>

      <button
        onClick={() => deleteJob(job._id)}
        className="px-3 py-1 bg-red-600 text-white rounded"
      >
        Delete Job
      </button>
    </div>
  </>
)}

            <button onClick={() => viewApplicants(job._id)} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Applicants
            </button>

            {applicants[job._id] && (
              <div className="mt-3 border-t pt-2 space-y-2">
                {applicants[job._id].length === 0 ? (
                  <p className="text-gray-600">No applicants yet.</p>
                ) : (
                  applicants[job._id].map(app => (
                    <div key={app._id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                      <div>
                        <p><strong>Name:</strong> {app.user.fullname}</p>
                        <p><strong>Email:</strong> {app.user.email}</p>
                        <p><strong>Status:</strong> {app.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(job._id, app._id, "Viewed")} className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                          Mark Viewed
                        </button>
                        <button onClick={() => removeApplicant(job._id, app._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}