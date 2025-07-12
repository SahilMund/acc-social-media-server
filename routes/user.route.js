const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  loggedInUserInfo,
} = require("../controllers/user.controller");

const isLoggedIn = require("../middlewares/isLoggedIn"); // Adjust path accordingly

router.post("/signup", signup);
router.post("/login", signin);
router.get("/user/me", isLoggedIn, loggedInUserInfo);

module.exports = router;
