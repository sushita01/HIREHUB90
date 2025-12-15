import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "jobseeker"
  });
  const [err, setErr] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form.fullname, form.email, form.password, form.role);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {err && <div className="mb-3 text-red-600">{err}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="fullname"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Name"
          />
          <input
            name="email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Email"
          />
          <input
            name="password"
            onChange={handleChange}
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Password"
          />
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
