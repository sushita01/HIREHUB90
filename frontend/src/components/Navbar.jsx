import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-blue-600">HireHub</h1>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">Search</Link>

          {user ? (
            <>
              {user.role === "jobseeker" && (
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Jobs</Link>
              )}
              {user.role === "recruiter" && (
                <Link to="/job-post" className="text-gray-700 hover:text-blue-600 font-medium">Post Job</Link>
              )}
               {user.role === "recruiter" && (
                <Link to="/recruiter-dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
