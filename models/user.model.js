const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name should be a required field"],
    },
    email: {
      type: String,
      required: [true, "email should be a required field"],
      unique: [true, "email should be a unique field"],
      //can use match over here for regex pattern match
    },
    password: {
      type: String,
      required: [true, "password should be a required field"],
    },
    role: {
      type: String,
      enum: ["personal", "creator"],
      default: "personal",
    },
    isOAuth: {
      type: Boolean,
      default:false
    },
    authProvider: String,
    profilePic: String
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = model("User", userSchema);
module.exports = User;
