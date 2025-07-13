const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const sendResponse = require("../utils/response");

module.exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse(res, false, "Post Not Found!", null);
    }

    const newComment = new Comment({
      text,
      post: postId,
      user: req.user.id,
    });

    const savedComment = await newComment.save();
    const response = await savedComment.populate("user");

    sendResponse(res, true, "Comment Added Successfully!", response);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendResponse(res, false, "No comment founds", null);
    }

    if (req.user.id !== comment.user.toString()) {
      return sendResponse(res, false, "Un Authorised", null);
    }

    await Comment.deleteOne({ _id: commentId });

    sendResponse(res, true, "Comment Deleted Successfully!", null);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};

module.exports.getCommentsById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return sendResponse(res, false, "Post Id is a required", null);
    }

    const comments = await Comment.find({ post: postId }).populate("user")
    if (!comments || comments.length === 0) {
      return sendResponse(res, false, "No Comments found", null);
    }

    sendResponse(res, true, "Post Fetched Successfully!", comments);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};
