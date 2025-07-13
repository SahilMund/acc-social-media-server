const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      //TODO: Implement regex validation in email field
      type: String,
      required: [true, "Caption should be a required field"],
    },
    image: String,
    imageId: String,
    gallery: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
module.exports = Post;
