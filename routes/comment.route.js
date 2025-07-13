const express = require("express");
const router = express.Router();

const { createComment, deleteComment, getCommentsById } = require("../controllers/comment.controller");
const isLoggedIn = require("../middlewares/isLoggedIn");
//cloudinary uploads
router.post("/create/:postId", isLoggedIn, createComment);
router.delete("/:commentId", isLoggedIn, deleteComment);
router.get("/:postId", isLoggedIn, getCommentsById);

module.exports = router;
