import { useState } from "react";
import { Link } from "react-router-dom";
import { jobs } from "../data/jobs";

export default function Home() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Filter jobs by title or location
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto pt-16 px-4">
        {/* Hero Section */}
        <h1 className="text-4xl font-bold text-gray-900">Find Your Dream Job</h1>
        <p className="mt-3 text-gray-600">
          Discover thousands of job opportunities from top companies.
        </p>

        {/* Search Bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by job title or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Featured Jobs */}
        <h2 className="mt-12 text-2xl font-bold text-gray-800">Featured Jobs</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {currentJobs.length === 0 ? (
            <div className="text-gray-600 col-span-3">
              No jobs found for your search.
            </div>
          ) : (
            currentJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow p-6 flex flex-col">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600 mt-1">{job.company} · {job.location}</p>
                <p className="text-gray-500 mt-2">{job.type} · {job.salary}</p>
                <Link
                  to={`/jobs/${job.id}`}
                  className="mt-4 inline-block text-center bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-400 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
