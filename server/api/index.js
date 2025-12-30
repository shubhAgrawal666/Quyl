import express from "express";
import connectDB from "../config/mongodb.js";
import authRoutes from "../routes/authRoutes.js";
import courseRoutes from "../routes/courseRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

connectDB();

app.use(
  cors({
    origin: ["https://quyl-frontend.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend running on Vercel",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quyl Learning Platform API",
    version: "1.0.0",
  });
});

export default app;
