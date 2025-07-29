const { forgotPasswordService } = require("../services/reset-password.service");
const sendResponse = require("../utils/response");
const PasswordReset = require("../models/forget-password.model");
const User = require("../models/user.model");

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const {message, resetLink, token} = await forgotPasswordService(email);
    sendResponse(res, true, message, {resetLink, token});
  } catch (err) {
    sendResponse(res, false, err.message, null);
  }
};

module.exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const resetToken = await PasswordReset.findOne({ token });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      sendResponse(res, false, "Invalid or expired token", null);
    }

    //update password
    await User.findByIdAndUpdate(resetToken.userId, {
      password: newPassword,
    });

    resetToken.used = true;
    await resetToken.save();

    sendResponse(res, true, "Password reset successfully", null);
  } catch (err) {
    sendResponse(res, false, err.message, null);
  }
};
