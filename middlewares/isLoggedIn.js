const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");

dotenv.config();

const isLoggedIn = async (req, res, next) => {
  try {
    const bearerToken = req?.headers?.authorization;
    //cookie based atuh = const token = req.cookies.token;

    if (!bearerToken) {
      return res.status(500).send({
        data: "User Not LoggedIN",
      });
    }

    const token = bearerToken.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: decodedToken?.id, isActive: true });

    if (!user) {
      return res.status(404).send({
        data: "User Not found",
      });
    }

    req.user = {
      id: decodedToken?.id,
      email: decodedToken?.email,
      role: user.role ?? "personal",
    };

    if (!user) {
      return res.status(500).send({
        data: "User Not LoggedIN",
      });
    }

    next();
  } catch (error) {
    console.log("error", error.message);
    res.status(500).send({
      data: error.message,
    });
  }
};

module.exports = isLoggedIn;
