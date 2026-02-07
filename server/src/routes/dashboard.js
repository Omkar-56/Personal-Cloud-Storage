import express from "express";
import pool from "../config/db.js"; // your pg Pool
import { verifyToken } from "../middleware/authMiddleware.js"; // JWT auth middleware

const router = express.Router();

const USER_QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB per user

router.get("/overview", verifyToken, async (req, res) => {
  const userId = req.user.id; // make sure your JWT puts UUID here

  console.log("Dashboard overview for user:", userId);

  try {
    // 1) Get user basic info (optional but nice for header)
    const userResult = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2) Files stats: total files + used bytes
    const filesStatsResult = await pool.query(
      `
      SELECT 
        COUNT(*)::int AS total_files,
        COALESCE(SUM(size), 0)::bigint AS used_bytes
      FROM files
      WHERE user_id = $1
      `,
      [userId]
    );

    const { total_files, used_bytes } = filesStatsResult.rows[0];

    // 3) Folders count
    const foldersStatsResult = await pool.query(
      `
      SELECT COUNT(*)::int AS total_folders
      FROM folders
      WHERE user_id = $1
      `,
      [userId]
    );

    const { total_folders } = foldersStatsResult.rows[0];

    // 4) Starred items (optional: if you don't have is_starred, just set 0)
    let starred_count = 0;
    try {
      const starredStatsResult = await pool.query(
        `
        SELECT COUNT(*)::int AS starred_count
        FROM files
        WHERE user_id = $1
          AND is_starred = true
        `,
        [userId]
      );
      starred_count = starredStatsResult.rows[0].starred_count;
    } catch (e) {
      // if column doesn't exist, keep 0 and don't crash
      console.warn("is_starred column missing, starred_count set to 0");
    }

    // 5) Recent files (last 5)
    let recentFiles = 0;
    const recentFilesResult = await pool.query(
      `
      SELECT 
        id,
        name,
        type,
        size,
        created_at
      FROM files
      WHERE user_id = $1
      ORDER BY created_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT 5
      `,
      [userId]
    );

    recentFiles = recentFilesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      size: Number(row.size),
      updatedAt: row.created_at,
    }));

    // 6) Final response shape (IMPORTANT: matches the frontend code)
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalFiles: total_files,
        totalFolders: total_folders,
        usedBytes: Number(used_bytes),
        quotaBytes: USER_QUOTA_BYTES,
        starredCount: starred_count,
      },
      recentFiles,
    });
  } catch (err) {
    console.error("Error in GET /api/dashboard/overview:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
