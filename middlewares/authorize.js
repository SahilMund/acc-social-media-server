const User = require("../models/user.model");
const sendResponse = require("../utils/response");

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendResponse(res, false, "Access Denied", null, 403);
  }

  next();
};

module.exports = authorize;
