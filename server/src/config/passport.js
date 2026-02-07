// src/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js";          // make sure this path is correct
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Google profile has no email"), null);
        }

        // 1) Check if user with this email already exists
        const existingRes = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        let user;

        if (existingRes.rows.length > 0) {
          user = existingRes.rows[0];

          // If user exists but no provider_id, link Google account
          if (!user.provider_id) {
            const updated = await pool.query(
              `
              UPDATE users
              SET provider_id = $1,
                  provider = CASE WHEN provider = 'local' THEN 'local' ELSE 'google' END
              WHERE id = $2
              RETURNING *;
              `,
              [googleId, user.id]
            );
            user = updated.rows[0];
          }

          // If provider is something else, still allow login as long as email matches.
        } else {
          // 2) Create new Google-only user (no password)
          const insertRes = await pool.query(
            `
            INSERT INTO users (name, email, password_hash, provider, provider_id)
            VALUES ($1, $2, NULL, 'google', $3)
            RETURNING *;
            `,
            [name, email, googleId]
          );
          user = insertRes.rows[0];
        }

        return done(null, user);
      } catch (err) {
        console.error("❌ Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// We are using JWT (no sessions), so serialize/deserialize are not strictly needed,
// but they don't hurt if Passport tries to use them somewhere.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (res.rows.length === 0) return done(null, false);
    done(null, res.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
