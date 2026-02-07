// routes/upload.js (add/replace the GET "/" handler and add download-url route)
import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getSignedDownloadUrl, streamObjectToResponse, uploadBufferToS3, deleteObject  } from "../utils/storage.js";
import { uploadMemory } from "../config/multerMemory.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/upload", verifyToken, uploadMemory.array("files", 10), async (req, res) => {
  const user_id = req.user.id;
  const { folder_id } = req.body; // optional
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const uploadedRows = [];

    for (const file of req.files) {
      // Build a safe key: users/{userId}/{timestamp}_{uuid}_{originalname}
      const key = `users/${user_id}/${Date.now()}_${uuidv4()}_${file.originalname.replace(/\s+/g, "_")}`;

      // Upload to MinIO/S3
      await uploadBufferToS3({
        buffer: file.buffer,
        key,
        contentType: file.mimetype,
      });

      // Insert metadata into Postgres
      // Ensure your files table has columns: name, type, size, key, folder_id, user_id, backend, created_at
      const result = await pool.query(
        `INSERT INTO files (name, type, size, key, folder_id, user_id, backend)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, type, size, key, folder_id, user_id, backend, created_at`,
        [file.originalname, file.mimetype, file.size, key, folder_id || null, user_id, "minio"]
      );

      uploadedRows.push(result.rows[0]);
    }

    return res.status(201).json({ message: "Files uploaded", files: uploadedRows });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


// GET /api/files?folder_id=...
// Returns files metadata for the user. For S3/MinIO files we attach a short-lived presigned `url` for preview/download.
router.get("/", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const { folder_id } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT id, name, type, size, key, path, folder_id, user_id, backend, created_at
      FROM files
      WHERE user_id = $1
        AND (folder_id = $2 OR (folder_id IS NULL AND $2 IS NULL))
      ORDER BY created_at DESC
      `,
      [user_id, folder_id || null]
    );

    const rows = result.rows;

    // For files stored in MinIO/S3, generate short-lived signed URLs for preview (images, pdfs, small files)
    // For performance, only generate URLs for items where backend === 'minio'
    const itemsWithUrls = await Promise.all(
      rows.map(async (f) => {
        if (f.backend === "minio" && f.key) {
          try {
            // expiration short for previews (e.g. 60s)
            const url = await getSignedDownloadUrl(f.key, 60);
            return { ...f, url };
          } catch (err) {
            console.warn("Failed to create signed URL for", f.key, err.message || err);
            return { ...f, url: null };
          }
        } else if (f.backend === "local" && f.path) {
          // If still serving local files via express.static("/uploads"), you can construct a public url:
          // e.g. `${process.env.SERVER_BASE_URL || ''}/uploads/${relativePathFromUploads}`
          return { ...f, url: null };
        }
        return { ...f, url: null };
      })
    );

    res.json(itemsWithUrls);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/files/download-url/:id
// Returns a presigned GET URL for a single file (useful before opening/downloading).
router.get("/download-url/:id", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const id = req.params.id;

  try {
    const q = await pool.query("SELECT id, name, type, key, path, backend, user_id FROM files WHERE id=$1", [id]);
    if (q.rows.length === 0) return res.status(404).json({ message: "File not found" });

    const file = q.rows[0];
    // security: ensure owner or implement sharing rules
    if (file.user_id !== user_id) return res.status(403).json({ message: "Access denied" });

    if (file.backend === "minio") {
      const url = await getSignedDownloadUrl(file.key, 300); // 5 minutes
      return res.json({ url, name: file.name, type: file.type });
    } else if (file.backend === "local") {
      // If you still serve local files via express.static("/uploads"), construct URL or stream:
      // Option A: return direct public URL
      // const base = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      // return res.json({ url: `${base}/uploads/${pathRelative}` });

      // Option B: stream the file through the server:
      res.setHeader("Content-Type", file.type || "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${file.name.replace(/"/g,"")}"`);
      return streamObjectToResponse(file.key, res); // streams local file if storage helper handles local
    } else {
      return res.status(400).json({ message: "Unknown backend" });
    }
  } catch (err) {
    console.error("download-url error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/delete", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No file ids provided" });
  }

  try {
    // 1) Fetch files owned by this user with those ids
    const result = await pool.query(
      `
      SELECT id, name, key, path, backend
      FROM files
      WHERE user_id = $1
        AND id = ANY($2::uuid[])
      `,
      [user_id, ids]
    );

    const filesToDelete = result.rows;

    // 2) Delete from storage (MinIO / local)
    for (const file of filesToDelete) {
      let storageKey = file.key;
      let backend = file.backend || "minio";

      if (!storageKey && file.path) {
        // old local entries
        storageKey = `local:${file.path}`;
        backend = "local";
      }

      if (storageKey) {
        try {
          await deleteObject(storageKey, backend);
        } catch (err) {
          console.warn(
            `Failed to delete storage object for file ${file.id}:`,
            err.message || err
          );
        }
      }
    }

    // 3) Delete rows from DB
    await pool.query(
      `
      DELETE FROM files
      WHERE user_id = $1
        AND id = ANY($2::uuid[])
      `,
      [user_id, ids]
    );

    return res.json({
      message: "Files deleted",
      deletedCount: filesToDelete.length,
    });
  } catch (err) {
    console.error("Error deleting files:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/star", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { star } = req.body; // true or false
  const userId = req.user.id;

  const result = await pool.query(
    `UPDATE files 
     SET is_starred = $1,
      starred_at = CASE WHEN $1 = true THEN NOW() ELSE starred_at END
     WHERE id = $2 AND user_id = $3
     RETURNING id, is_starred, starred_at`,
    [star, id, userId]
  );

  res.json(result.rows[0]);
});

router.put("/:id/trash", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await pool.query(
    `UPDATE files 
     SET is_deleted = true
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [id, userId]
  );

  res.json({ message: "Moved to trash" });
});

router.get("/starred", verifyToken, async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT id, name, size, type, starred_at, key
    FROM files
    WHERE user_id = $1 AND is_starred = true
    ORDER BY starred_at DESC NULLS LAST
    `,
    [userId]
  );

  res.json(result.rows);
});

export default router;
