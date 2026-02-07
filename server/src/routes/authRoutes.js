// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import pool from "../config/db.js";
import "../config/passport.js"; // ensures passport strategy is registered

const router = express.Router();

// Helper to issue JWT
function issueToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// ✅ Register (local email + password)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      const user = existing.rows[0];

      // If this email is already used with Google-only login
      if (!user.password && user.provider === "google") {
        return res.status(400).json({
          message: "This email is already registered with Google. Please sign in with Google.",
        });
      }

      // If local already exists
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new local user
    const insertRes = await pool.query(
      `
      INSERT INTO users (name, email, password_hash, provider, provider_id)
      VALUES ($1, $2, $3, 'local', NULL)
      RETURNING id, name, email, provider, created_at;
      `,
      [name || null, email, hashedPassword]
    );

    const user = insertRes.rows[0];

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Local Login (email + password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // If this account is Google-only (no password set)
    if (!user.password && user.provider === "google") {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password || "");
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = issueToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Google OAuth start
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = issueToken(user);

    // Redirect back to frontend with token (adjust URL if needed)
    const redirectUrl = `http://localhost:5173/login?token=${token}`;
    return res.redirect(redirectUrl);
  }
);

export default router;
