const User = require("../models/user.model");
const crypto = require("crypto");
const PasswordReset = require("../models/forget-password.model");
const dotenv = require("dotenv");
const sendResponse = require("../utils/response");
const sendMail = require("../utils/sendMail");

dotenv.config();

module.exports.forgotPasswordService = async (email) => {
  const user = await User.findOne({ email, isActive: true });

  if (!user) {
    return sendResponse(res, false, "User not found", null);
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); //15 mins

  console.log("user", user);

  await PasswordReset.create({
    userId: user._id,
    token,
    expiresAt,
  });

  const resetLink = `${process.env.CLIENT_APP_URL}/reset-password?token=${token}`;

  await sendMail({
    to: user.email,
    subject: `Password Reset Link | ${user.name}`,
    html: `<div>Hey ${user.name}, Greetings !!
     <p>Here is your below password reset link, note that it will be expired after 15 mins</p>
     <a href=${resetLink} target="_blank"><button>Reset Password</button> </a>
      </div>`,
  });

  return {
    message: "If the email is exists, a reset link has been sent !!",
    resetLink,
    token,
  };
};
