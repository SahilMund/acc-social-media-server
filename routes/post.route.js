const express = require("express");
const upload = require("../config/multer");
const router = express.Router();

const {
  uploadToDiskStorage,
  multipleUploadToDiskStorage,
  uploadToCloudinary,
} = require("../controllers/post.controller");

// const isLoggedIn = require("../middlewares/isLoggedIn"); // Adjust path accordingly

router.post("/upload/disk", upload.single("image"), uploadToDiskStorage);
router.post(
  "/upload/disk/multiple",
  upload.array("images"),
  multipleUploadToDiskStorage
);

//cloudinary uploads
router.post("/upload", upload.single("image"), uploadToCloudinary);

module.exports = router;
