import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import pool from "./config/db.js";  // ✅ add this import

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Test DB connection on startup
pool.query("SELECT NOW()")
  .then(res => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

// Routes
app.use("/api/auth", authRoutes);

export default app;
