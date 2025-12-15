import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import jobRoute from "./routes/job.route.js";
import userRoute from "./routes/user.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// FIXED CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// CONNECT DATABASE
connectDB();

// ROUTES
app.use("/api/v1/user", userRoute);
app.use("/api/v1/applications", applicationRoute);
app.use("/api/v1/jobs", jobRoute);

// START SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
