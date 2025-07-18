const express = require("express");

const router = express.Router();
const passport = require("passport");

const {
  signup,
  signin,
  loggedInUserInfo,
  updateUserInfo,
  getAllUser,
} = require("../controllers/user.controller");

require("../config/passport");

const isLoggedIn = require("../middlewares/isLoggedIn"); // Adjust path accordingly
const authorize = require("../middlewares/authorize"); // Adjust path accordingly

router.post("/auth/signup", signup);
router.post("/auth/login", signin);
router.get("/user/me", isLoggedIn, loggedInUserInfo);
router.get("/users", isLoggedIn, getAllUser);
router.put("/user/profile", isLoggedIn, updateUserInfo);

//google oauth2.0 routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect(`http://localhost:5173/`);
  }
);

module.exports = router;
