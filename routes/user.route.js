const express = require("express");

const router = express.Router();

const { signup, signin } = require("../controllers/user.controller");

router.post("/signup", signup);
router.post("/login", signin);

module.exports = router;
