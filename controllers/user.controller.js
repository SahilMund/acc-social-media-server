const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "jwtprviatesecrekey-123-abc";

module.exports.signup = async (req, res) => {
  //   1. Get the data
  //   2. validate for the required fields (from mongoose or custom validation)
  //   3. validate the patterns for email and phone field values (from mongoose or custom validation)
  //   4. whether the user is already exissts or not
  // 5. hash the password
  // 6. store in the db
  //
  try {
    const { name, email, password } = req.body;
    console.log("d", req.body);
    const newUser = await User.insertOne({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        id: newUser._id,
      },
      SECRET_KEY,
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
    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password ?? "");

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
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

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
    const user = await User.findById(req?.user?.id);

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
