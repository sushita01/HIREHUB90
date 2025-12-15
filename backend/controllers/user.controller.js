import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// REGISTER: Create a new user
export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    // Validation
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    if (!["jobseeker", "recruiter"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOGIN: Authenticate user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
