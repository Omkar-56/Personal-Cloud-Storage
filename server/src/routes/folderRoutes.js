import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { deleteObject } from "../utils/storage.js";

const router = express.Router();

// Create folder
router.post("/", verifyToken, async (req, res) => {
  const { name, parent_id } = req.body;
  const user_id = req.user.id; // 🟩 Extracted from token

  try {
    const result = await pool.query(
      "INSERT INTO folders (name, parent_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, parent_id || null, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get folders for current user
router.get("/", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const { parent_id } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT * FROM folders
      WHERE user_id = $1 AND (parent_id = $2 OR (parent_id IS NULL AND $2 IS NULL))
      ORDER BY created_at DESC
      `,
      [user_id, parent_id || null]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/path/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const path = [];
    let currentId = id;

    while (currentId) {
      const result = await pool.query(
        "SELECT id, name, parent_id FROM folders WHERE id = $1 AND user_id = $2",
        [currentId, userId]
      );

      if (result.rows.length === 0) break;
      const folder = result.rows[0];
      path.unshift(folder);
      currentId = folder.parent_id;
    }

    res.json(path);
  } catch (err) {
    console.error("Error fetching folder path:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/delete", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No folder ids provided" });
  }

  try {
    // STEP 1: find all folders recursively
    const cte = await pool.query(
      `
      WITH RECURSIVE subfolders AS (
        SELECT id
        FROM folders
        WHERE user_id = $1 AND id = ANY($2::uuid[])

        UNION ALL

        SELECT f.id
        FROM folders f
        INNER JOIN subfolders sf ON f.parent_id = sf.id
      )
      SELECT id FROM subfolders;
      `,
      [user_id, ids]
    );

    const allFolderIds = cte.rows.map((r) => r.id);

    if (allFolderIds.length === 0) {
      return res.json({ message: "Nothing to delete" });
    }

    // STEP 2: fetch all files in those folders
    const filesResult = await pool.query(
      `
      SELECT id, key, path, backend
      FROM files
      WHERE user_id = $1 AND folder_id = ANY($2::uuid[])
      `,
      [user_id, allFolderIds]
    );

    const filesToDelete = filesResult.rows;

    // STEP 3: delete files from MinIO/local
    for (const file of filesToDelete) {
      let storageKey = file.key;
      let backend = file.backend || "minio";

      if (!storageKey && file.path) {
        storageKey = `local:${file.path}`;
        backend = "local";
      }

      if (storageKey) {
        try {
          await deleteObject(storageKey, backend);
        } catch (err) {
          console.warn(`Failed to delete storage object ${storageKey}:`, err.message);
        }
      }
    }

    // STEP 4: delete files from DB
    await pool.query(
      `
      DELETE FROM files
      WHERE user_id = $1 AND folder_id = ANY($2::uuid[])
      `,
      [user_id, allFolderIds]
    );

    // STEP 5: delete folders themselves
    await pool.query(
      `
      DELETE FROM folders
      WHERE user_id = $1 AND id = ANY($2::uuid[])
      `,
      [user_id, allFolderIds]
    );

    return res.json({
      message: "Folders deleted",
      deletedFolders: allFolderIds.length,
      deletedFiles: filesToDelete.length,
    });
  } catch (err) {
    console.error("Error deleting folders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
