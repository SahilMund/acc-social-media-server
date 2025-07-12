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
  },
  { timestamps: true }
);

// postSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(15);
//   const hashedPassword = await bcrypt.hash(this.password, salt);
//   this.password = hashedPassword;
//   next();
// });

const Posts = model("Posts", postSchema);
module.exports = Posts;
