import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../context/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user || user.role !== "jobseeker") return;

    const fetchApps = async () => {
      try {
        const { data } = await api.get(`/v1/applications/user/${user._id}`);
        if (data.success) setApps(data.applications);
      } catch (err) {
        setMsg(err.response?.data?.message || "Failed to fetch applications");
      }
    };

    fetchApps();
  }, [user]);

  const removeApp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      const { data } = await api.delete(`/v1/applications/${id}`);
      if (data.success) {
        setApps((prev) => prev.filter((a) => a._id !== id));
        setMsg("Application deleted successfully");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to delete application");
    }
  };

  if (!user) return <div className="p-6">Please login to view your dashboard.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">My Applications</h1>
      {msg && <div className="mt-2 text-green-700">{msg}</div>}
      <div className="mt-6 space-y-4">
        {apps.length === 0 ? (
          <div className="text-gray-600">No applications yet. Apply from a job details page.</div>
        ) : (
          apps.map((a) => (
            <div key={a._id} className="bg-white rounded-xl shadow p-5">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">{a.job?.title || a.jobTitle}</div>
                  <div className="text-gray-600">{a.job?.company || a.company}</div>
                  <div className="text-gray-500">{a.job?.location || "N/A"} · {a.job?.type || "N/A"} · {a.job?.salary || "N/A"}</div>
                  <div className="text-sm text-gray-500 mt-1">Status: {a.status}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => removeApp(a._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}