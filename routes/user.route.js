const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  loggedInUserInfo,
  updateUserInfo,
  getAllUser,
} = require("../controllers/user.controller");

const isLoggedIn = require("../middlewares/isLoggedIn"); // Adjust path accordingly
const authorize = require("../middlewares/authorize"); // Adjust path accordingly

router.post("/auth/signup", signup);
router.post("/auth/login", signin);
router.get("/user/me", isLoggedIn, loggedInUserInfo);
router.get("/users", isLoggedIn, getAllUser);
router.put("/user/profile", isLoggedIn, updateUserInfo);


module.exports = router;
