const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const passwordResetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const passwordReset = model("PasswordReset", passwordResetSchema);
module.exports = passwordReset;
