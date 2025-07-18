const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

console.log(process.env.GOOGLE_CLIENT_ID);

const strategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const verify = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    console.log("profile", profile);
    console.log("user", user);

    if (!user) {
      //singup flow
      const salt = await bcrypt.genSalt(10);

      const randomPassword = crypto.randomBytes(20).toString("hex");

      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: hashedPassword,
        isOAuth: true,
        authProvider: profile.provider,
        profilePice: profile.photos[0].value,
      });
    }

    done(null, user); //login flow
  } catch (error) {
    console.error("error", error);
    done(error, null);
  }
};

passport.use(new GoogleStrategy(strategyOptions, verify));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
