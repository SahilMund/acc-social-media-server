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
      //TODO: Implement regex validation in email field
      type: String,
      required: [true, "email should be a required field"],
      unique: [true, "email should be a unique field"],
    },
    password: {
      type: String,
      required: [true, "password should be a required field"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const Users = model("Users", userSchema);
module.exports = Users;
