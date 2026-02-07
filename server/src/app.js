// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import dashboardRouter from "./routes/dashboard.js"
import shareRoutes from "./routes/shareRoutes.js"

import { s3 } from "./utils/s3client.js"; 
import { HeadBucketCommand } from "@aws-sdk/client-s3";

dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If you still rely on local uploads during migration, uncomment this.
// app.use("/uploads", express.static("uploads"));

// health / root
app.get("/", (req, res) => res.send("File/Folder API running"));

// ---- Startup checks ---- //
// 1) Postgres connectivity
pool.query("SELECT NOW()")
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err.message || err));

// 2) MinIO / S3 connectivity (optional but useful)
(async () => {
  try {
    const bucket = process.env.MINIO_BUCKET;
    if (!bucket) {
      console.warn("⚠ MINIO_BUCKET not set — skipping MinIO connectivity check");
      return;
    }
    // HeadBucket returns metadata if bucket exists / credentials valid
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✅ MinIO/S3 bucket "${bucket}" is reachable`);
  } catch (err) {
    console.warn("⚠ Unable to reach MinIO/S3 bucket:", err.message || err);
    // do not crash — continue running so you can debug; optional: process.exit(1)
  }
})();

// register routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/share", shareRoutes);

// basic error handler (JSON)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
