import { useState, useEffect } from "react";
import { jobs as mockJobs } from "../data/jobs";
import api from "../context/api";
import { Link } from "react-router-dom";

export default function Search() {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    jobType: "",
    experience: "",
    salaryRange: [0, 200000],
  });
  const [postedJobs, setPostedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/v1/jobs"); // fetch all posted jobs
        if (data.success) setPostedJobs(data.jobs);
      } catch (err) {
        console.log("Failed to fetch posted jobs:", err.message);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const allJobs = [...mockJobs, ...postedJobs]; // combine mock + real posted jobs

  const filteredJobs = allJobs.filter((job) => {
    const categoryMatch = filters.category
      ? job.type === filters.category
      : true;
    const locationMatch = filters.location
      ? job.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const jobTypeMatch = filters.jobType
      ? job.type.toLowerCase() === filters.jobType.toLowerCase()
      : true;
    const experienceMatch = filters.experience
      ? job.experience === filters.experience
      : true;
    const salaryMatch = job.salary
      ? parseInt(job.salary.replace("$", "").replace("k", "000")) >=
          filters.salaryRange[0] &&
        parseInt(job.salary.replace("$", "").replace("k", "000")) <=
          filters.salaryRange[1]
      : true;
    return (
      categoryMatch && locationMatch && jobTypeMatch && experienceMatch && salaryMatch
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Search</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-2 border rounded"
        />
        <input
          name="jobType"
          value={filters.jobType}
          onChange={handleChange}
          placeholder="Job Type"
          className="p-2 border rounded"
        />
        <input
          name="experience"
          value={filters.experience}
          onChange={handleChange}
          placeholder="Work Experience"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="salaryMin"
          placeholder="Min Salary"
          onChange={(e) =>
            setFilters({
              ...filters,
              salaryRange: [Number(e.target.value), filters.salaryRange[1]],
            })
          }
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="salaryMax"
          placeholder="Max Salary"
          onChange={(e) =>
            setFilters({
              ...filters,
              salaryRange: [filters.salaryRange[0], Number(e.target.value)],
            })
          }
          className="p-2 border rounded"
        />
      </div>

      {/* Jobs List */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="text-gray-600 col-span-3">
            No jobs match your filters
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link
              to={`/jobs/${job._id || job.id}`} // Navigate to JobDetails
              key={job._id || job.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-gray-600">
                {job.company} · {job.location}
              </p>
              <p className="text-gray-500">
                {job.type} · {job.salary || "N/A"}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}