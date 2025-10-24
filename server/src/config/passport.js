import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js";
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
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user exists
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        let user;
        if (existing.rows.length > 0) {
          user = existing.rows[0];
        } else {
          // Insert new user
          const result = await pool.query(
            "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *",
            [name, email, googleId]
          );
          user = result.rows[0];
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
