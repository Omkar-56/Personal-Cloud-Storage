import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getSignedDownloadUrl } from "../utils/storage.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/* --------------------------------------------------
   CREATE PUBLIC SHARE LINK (AUTH REQUIRED)
   POST /api/share/files/:id
--------------------------------------------------- */
router.post("/files/:id", verifyToken, async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;
  const { expiresInDays, password } = req.body;

  try {
    // 1. Verify ownership
    const fileResult = await pool.query(
      "SELECT id FROM files WHERE id = $1 AND user_id = $2",
      [fileId, userId]
    );

    if (!fileResult.rows.length) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 2. Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // 3. Optional expiry
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(expiresInDays));
    }

    // 4. Optional password
    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : null;

    // 5. Save share
    await pool.query(
      `
      INSERT INTO file_shares
      (id, file_id, owner_id, token, password_hash, expires_at)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [uuidv4(), fileId, userId, token, passwordHash, expiresAt]
    );

    res.status(201).json({
      token,
    });
  } catch (err) {
    console.error("Create share error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------
   PUBLIC ACCESS (NO AUTH)
   GET /api/share/:token
--------------------------------------------------- */
router.get("/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        fs.password_hash,
        fs.expires_at,
        f.key,
        f.type,
        f.name,
        f.size
      FROM file_shares fs
      JOIN files f ON fs.file_id = f.id
      WHERE fs.token = $1
      `,
      [token]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    const share = result.rows[0];

    // Expiry check
    if (share.expires_at && new Date() > share.expires_at) {
      return res.status(410).json({ message: "Link expired" });
    }

    // Password required
    if (share.password_hash) {
      return res.status(401).json({ message: "Password required" });
    }

    // Generate short-lived signed URL
    const url = await getSignedDownloadUrl(share.key, 60);

    res.json({
      file: {
        name: share.name,
        size: share.size,
        mime_type: share.type,
      },
      url,
    });
  } catch (err) {
    console.error("Public share access error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------
   PASSWORD VERIFY (NO AUTH)
   POST /api/share/:token/verify
--------------------------------------------------- */
router.post("/:token/verify", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const result = await pool.query(
      `
      SELECT fs.password_hash, fs.expires_at,
             f.key, f.type
      FROM file_shares fs
      JOIN files f ON fs.file_id = f.id
      WHERE fs.token = $1
      `,
      [token]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Invalid link" });
    }

    const share = result.rows[0];

    if (!share.password_hash) {
      return res.status(400).json({ message: "No password required" });
    }

    if (share.expires_at && new Date() > share.expires_at) {
      return res.status(410).json({ message: "Link expired" });
    }

    const ok = await bcrypt.compare(password, share.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const url = await getSignedDownloadUrl(share.key, 60);

    res.json({
      url,
      mimeType: share.type,
    });
  } catch (err) {
    console.error("Password verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------
   REVOKE SHARE (AUTH REQUIRED)
   DELETE /api/share/:token
--------------------------------------------------- */
router.delete("/:token", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { token } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM file_shares
      WHERE token = $1 AND owner_id = $2
      `,
      [token, userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Share not found" });
    }

    res.json({ message: "Share revoked" });
  } catch (err) {
    console.error("Revoke share error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
