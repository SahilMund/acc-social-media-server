const express = require("express");

const router = express.Router();

router.use("/", require("./user.route"));
router.use("/analytics", require("./analytics.route"));
router.use("/post", require("./post.route"));
router.use("/comment", require("./comment.route"));

module.exports = router;
