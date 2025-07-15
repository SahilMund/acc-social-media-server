const express = require("express");

const router = express.Router();

const {
getPostsByDate
} = require("../controllers/analytics.controller");

const isLoggedIn = require("../middlewares/isLoggedIn");
const authorize = require("../middlewares/authorize");

router.get(
  "/get-posts-by-date",
  isLoggedIn,
  authorize(["creator"]),
  getPostsByDate
);

module.exports = router;
