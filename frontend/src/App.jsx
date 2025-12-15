import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobDetails from "./pages/JobDetails";
import Dashboard from "./pages/Dashboard"; 
import JobPost from "./pages/JobPost";
import RecruiterDashboard from "./pages/RecruiterDashboard"; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/job-post" element={<JobPost />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
