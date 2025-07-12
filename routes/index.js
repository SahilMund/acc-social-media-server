const express = require("express");

const router = express.Router();

router.use("/auth", require('./user.route'));
router.use("/post", require('./post.route'));

module.exports = router;