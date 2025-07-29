const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");

const AUTH_TYPE = "";

module.exports.signup = async (req, res) => {
  //   1. Get the data
  //   2. validate for the required fields (from mongoose or custom validation)
  //   3. validate the patterns for email and phone field values (from mongoose or custom validation)
  //   4. whether the user is already exissts or not
  // 5. hash the password
  // 6. store in the db
  //
  try {
    const { name, email, password, role } = req.body;
    console.log("d", req.body);
    const newUser = await User.insertOne({
      name,
      email,
      password,
      role,
    });

    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.send({
      data: {
        user: newUser,
        token,
      },
      success: true,
      message: "USER Registered successfully !!",
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });

    console.log("user", user);

    const isMatch = await bcrypt.compare(password, user?.password ?? "");

    console.log("isMatch", isMatch);

    if (!user || !isMatch) {
      return res.send({
        data: null,
        success: false,
        message: "Email/Password do not match",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    if (AUTH_TYPE === "cookie-based-auth") {
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, //1 day;
      });

      res.session.user = user;
    }

    res.send({
      data: {
        token,
        user,
      },
      success: true,
      message: "USER LoggedIn successfully !!",
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
};

module.exports.loggedInUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req?.user?.id, isActive: true });

    res.status(200).send({
      data: {
        user,
      },
      success: true,
      message: "USER Details fetched successfully !!",
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
};

module.exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findOne({ isActive: true }).select("-password");

    res.status(200).send({
      data: {
        users,
      },
      success: true,
      message: "USER fetched successfully !!",
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const user = await User.findOne({ _id: userId, isActive: true });

    if (!user) {
      return res.status(404).send({
        data: null,
        success: false,
        message: "No user found",
      });
    }

    user.name = name;
    const updatedUser = await user.save();

    res.status(200).send({
      data: {
        updatedUser,
      },
      success: true,
      message: "USER updated successfully !!",
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
};

module.exports.followUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: req?.user?.id, isActive: true });

  if (!user) {
    return res.status(404).send({
      data: null,
      success: false,
      message: "No user found",
    });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { following: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $addToSet: { followers: req.user.id },
  });

  sendResponse(res, true, "User followed successfully", null);
};

module.exports.UnfollowUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: req?.user?.id, isActive: true });
  if (!user) {
    return res.status(404).send({
      data: null,
      success: false,
      message: "No user found",
    });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { followings: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $pull: { followers: req.user.id },
  });

  sendResponse(res, true, "User followed successfully", null);
};

module.exports.getFollowers = async (req, res) => {
  const user = awaitUser
    .findOne({ _id: req?.user?.id, isActive: true })
    .populate("followers", "name email");

  sendResponse(res, true, "success", user);
};

module.exports.getFollowings = async (req, res) => {
  const user = awaitUser
    .findOne({ _id: req?.user?.id, isActive: true })
    .populate("followings", "name email");

  sendResponse(res, true, "success", user);
};

module.exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.isActive = false;

  await user.save();

  sendResponse(res, true, "User Deleted Successfully", user);
};
