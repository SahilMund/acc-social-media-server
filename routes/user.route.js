const express = require("express");

const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config();
const {
  signup,
  signin,
  loggedInUserInfo,
  updateUserInfo,
  getAllUser,
  followUser,
  UnfollowUser,
  getFollowers,
  getFollowings,
  deleteUser,
} = require("../controllers/user.controller");

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/reset-password.controller");
require("../config/passport");

const isLoggedIn = require("../middlewares/isLoggedIn"); // Adjust path accordingly
const authorize = require("../middlewares/authorize"); // Adjust path accordingly

router.post("/auth/signup", signup);
router.post("/auth/login", signin);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);

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
    console.log(req.user);

    const token = jwt.sign(
      {
        email: req.user.email,
        name: req.user.name,
        id: req.user._id,
        role: req.user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.send({
      data: {
        token,
      },
      success: true,
      message: "USER logged in with google successfully !!",
      redirectUrl: `http://localhost:5173/`,
    });
  }
);

//followers and following
router.put("/user/follow/:userId", isLoggedIn, followUser);
router.put("/user/unfollow/:userId", isLoggedIn, UnfollowUser);
router.get("/user/followers", isLoggedIn, getFollowers);
router.get("/user/following", isLoggedIn, getFollowings);
router.put("/user/delete", isLoggedIn, deleteUser);

router.get("/user/me", (req, res) => {
  if (req.session.user._id) {
    res.send({
      user: req.session.user,
      message: "User is authenticated",
    });
  } else {
    res.send({
      user: null,
      message: "User is not authenticated",
    });
  }
});

router.get("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destory error: " + err);
      return res.status(500).send({
        message: "Logout failed",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });

    return res.send({ message: "Logout successfull" });
  });
});

module.exports = router;
