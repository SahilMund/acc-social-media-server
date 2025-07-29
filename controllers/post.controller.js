const cloudinary = require("../config/cloudinary");
const sendResponse = require("../utils/response");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

module.exports.uploadToDiskStorage = async (req, res) => {
  res.status(200).send({
    file: req.file,
    body: req.body,
  });
};

module.exports.multipleUploadToDiskStorage = async (req, res) => {
  res.status(200).send({
    file: req.file,
    files: req.files,
    body: req.body,
  });
};

module.exports.uploadToCloudinary = async (req, res) => {
  try {
    const uploadedDetails = await cloudinary.uploader.upload(req.file.path);

    const { secure_url: image, public_id: imageId } = uploadedDetails;

    sendResponse(res, true, "Image Uploaded Successfully", {
      image,
      imageId,
    });
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { text, image, imageId, isScheduled, scheduledTime } = req.body;

    const newPost = new Post({
      text,
      image,
      imageId,
      user: req.user.id,
      isScheduled,
      scheduledTime,
    });

    const savedPost = await newPost.save();

    sendResponse(res, true, "Post Created Successfully!", savedPost);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.editPost = async (req, res) => {
  try {
    const { text, image, imageId } = req.body;

    const { id } = req.params;

    if (!text) {
      return sendResponse(res, false, "Caption is a required field", null);
    }

    const foundPost = await Post.findById(id);

    if (!foundPost) {
      return sendResponse(res, false, "Post not found", null);
    }

    if (foundPost.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        false,
        "User is not authorized to modify this post",
        null
      );
    }

    if (text) {
      foundPost.text = text;
    }
    if (image) {
      foundPost.image = image;
    }
    if (imageId) {
      foundPost.imageId = imageId;
    }

    const savedPost = await foundPost.save();

    sendResponse(res, true, "Post Edited Successfully!", savedPost);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse(res, false, "No Post not found", null);
    }

    if (post.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        false,
        "User is not authorized to modify this post",
        null
      );
    }

    await cloudinary.uploader.destroy(post.imageId);
    await Post.deleteOne({ _id: postId });
    await Comment.deleteMany({ post: postId });

    sendResponse(res, true, "Post Deleted Successfully!", null);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, false, "Post Id is a required", null);
    }

    const foundPost = await Post.findById(id);

    if (!foundPost) {
      return sendResponse(res, false, "No Post not found", null);
    }

    if (foundPost.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        false,
        "User is not authorized to view this post",
        null
      );
    }

    sendResponse(res, true, "Post Fetched Successfully!", foundPost);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.getAllLoggedInUserPosts = async (req, res) => {
  try {
    const foundPosts = await Post.find({
      user: req.user.id,
      isScheduled: false,
    });

    if (!foundPosts || foundPosts.length === 0) {
      return sendResponse(res, false, "No Post not found", null);
    }

    sendResponse(
      res,
      true,
      "Logged In users Posts Fetched Successfully!",
      foundPosts
    );
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const foundPosts = await Post.find({ isScheduled: false });

    if (!foundPosts || foundPosts.length === 0) {
      return sendResponse(res, false, "No Post found", new Date());
    }

    sendResponse(res, true, "All Posts Fetched Successfully!", {
      foundPosts,
      nowIST,
    });
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.likePostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }

    if (post.likes.includes(req.user.id)) {
      return sendResponse(res, false, "User already liked the post", null);
    }

    post.likes.push(req.user.id);
    post.likesCount = post.likes.length;

    const updatedRecord = await post.save();

    sendResponse(res, true, "Post Liked Successfully!", updatedRecord);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.disLikePostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }

    if (!post.likes.includes(req.user.id)) {
      return sendResponse(res, false, "User has not yet liked the post", null);
    }

    post.likes = post.likes.filter((p) => p.toString() !== req.user.id);

    post.likesCount = post.likes.length;

    const updatedRecord = await post.save();

    sendResponse(res, true, "Post Disliked Successfully!", updatedRecord);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.postStatsById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }

    // const totalPosts = await Comment.find({ post: postId })
    const totalPosts = await Comment.countDocuments({ post: postId });

    const stats = {
      likesCount: post.likesCount,
      isLikedByMe: post.likes.includes(req.user.id),
      commentsCount: totalPosts,
    };

    sendResponse(res, true, "Stats fetched successfully", stats);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.getFeeds = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("user", "name email")
      .populate({
        path: "likes",
        select: "name email",
      })
      .sort("createdAt");

    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }
    sendResponse(res, true, "Stats fetched successfully", post);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

// sorting, searching and pagination

module.exports.getPostsAdditional = async (req, res) => {
  try {
    const {
      searchTerm,
      sortBy = "latest", // 'latest, oldest, popular
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      text: { $regex: searchTerm, $options: "i" },
    };

    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { likesCount: -1 },
    };

    const post = await Post.find(query)
      .sort(sortOptions[sortBy])
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }
    sendResponse(res, true, "Posts fetched successfully", post);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};
