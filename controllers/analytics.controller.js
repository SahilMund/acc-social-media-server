const sendResponse = require("../utils/response");
const Post = require("../models/post.model");
const mongoose = require("mongoose");

module.exports.getPostsByDate = async (req, res) => {
  try {
    const postStats = await Post.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    sendResponse(res, true, "Post Stats fetched Successfully!", postStats);
  } catch (err) {
    sendResponse(res, false, err?.message, null);
  }
};
