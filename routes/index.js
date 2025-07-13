const express = require("express");

const router = express.Router();

router.use("/auth", require("./user.route"));
router.use("/post", require("./post.route"));
router.use("/comment", require("./comment.route"));

module.exports = router;
