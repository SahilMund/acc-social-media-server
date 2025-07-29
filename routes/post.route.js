const express = require("express");
const upload = require("../config/multer");
const router = express.Router();

const {
  uploadToDiskStorage,
  multipleUploadToDiskStorage,
  uploadToCloudinary,
  createPost,
  editPost,
  deletePost,
  getPostById,
  getAllPosts,
  getAllLoggedInUserPosts,
  likePostById,
  disLikePostById,
  postStatsById,
  getFeeds,
  getPostsAdditional
} = require("../controllers/post.controller");
const isLoggedIn = require("../middlewares/isLoggedIn"); // Adjust path accordingly

router.post("/upload/disk", upload.single("image"), uploadToDiskStorage);
router.post(
  "/upload/disk/multiple",
  upload.array("images"),
  multipleUploadToDiskStorage
);

//cloudinary uploads
router.post("/upload", upload.single("image"), uploadToCloudinary);
router.post("/create", isLoggedIn, createPost);
router.put("/update/:id", isLoggedIn, editPost);
router.delete("/delete/:id", isLoggedIn, deletePost);
router.get("/view/:id", isLoggedIn, getPostById);
router.get("/my-posts", isLoggedIn, getAllLoggedInUserPosts);
router.get("/all-posts", isLoggedIn, getAllPosts);

// like and dislike
router.put("/like/:id", isLoggedIn, likePostById);
router.put("/unlike/:id", isLoggedIn, disLikePostById);

// feeds api

router.get("/stats/:postId", isLoggedIn, postStatsById);
router.get("/feed", isLoggedIn, getFeeds);
router.get("/search-pagination-sorting", isLoggedIn, getPostsAdditional);

module.exports = router;
