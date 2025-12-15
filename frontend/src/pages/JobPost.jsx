import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../context/api";
import { useNavigate } from "react-router-dom";

export default function JobPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
  });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const payload = {
        ...form,
        recruiter: user._id,
        requirements: form.requirements.split(",").map(r => r.trim()),
        benefits: form.benefits.split(",").map(b => b.trim())
      };
      const { data } = await api.post("/v1/jobs", payload);
      if (data.success) {
        setMsg("Job posted successfully!");
        setTimeout(() => navigate("/recruiter-dashboard"), 1500);
      }
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  if (!user || user.role !== "recruiter") return <div className="p-6">Only recruiters can access this page.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      {msg && <div className="text-green-600 mb-2">{msg}</div>}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input name="title" placeholder="Job Title" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="company" placeholder="Company" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="type" onChange={handleChange} className="w-full p-2 border rounded">
          <option>Full-time</option>
          <option>Part-time</option>
        </select>
        <input name="salary" placeholder="Salary" onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="requirements" placeholder="Requirements (comma separated)" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="benefits" placeholder="Benefits (comma separated)" onChange={handleChange} className="w-full p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Post Job</button>
      </form>
    </div>
  );
}
