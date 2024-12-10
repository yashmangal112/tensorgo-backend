//routes/auth.js

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credentialResponse } = req.body;

    const googleID = credentialResponse.googleID;
    const name = credentialResponse.name;
    const email = credentialResponse.email;
    const picture = credentialResponse.picture;
    // Check if the user already exists
    let user = await User.findOne({ googleID });
    if (!user) {
      user = new User({ googleID, name, email, picture });
      await user.save();
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ success: false, error: "Authentication failed" });
  }
});


// Google OAuth strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleID: profile.id });

        if (user) {
          // Update user data if profile data has changed
          user.name = profile.displayName || user.name;
          user.email = profile.emails[0].value || user.email;
          user.picture = profile.photos?.[0]?.value || user.picture;
          await user.save();
        } else {
          // Create a new user if not found
          user = new User({
            googleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos?.[0]?.value, // Save profile picture URL
          });
          await user.save();
        }

        // Pass the user object to the next middleware
        return done(null, user);
      } catch (err) {
        console.error("Error in Google OAuth strategy:", err);
        return done(err);
      }
    }
  )
);

// Serialize user ID to the session
passport.serializeUser((user, done) => {
  done(null, user._id); // Save the user's MongoDB ID to the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve the user from the database using ID
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Route to initiate Google OAuth authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google OAuth
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect to frontend with user info as query params or in a session
    res.redirect(`http://localhost:3000/dashboard?user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);


module.exports = router;
