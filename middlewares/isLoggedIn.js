const jwt = require("jsonwebtoken");
const SECRET_KEY = "jwtprviatesecrekey-123-abc";
const User = require("../models/user.model");

const isLoggedIn = async (req, res, next) => {
  try {
    const bearerToken = req?.headers?.authorization;

    if (!bearerToken) {
      return res.status(500).send({
        data: "User Not LoggedIN",
      });
    }

    const token = bearerToken.split(" ")[1];

    const decodedToken = jwt.verify(token, SECRET_KEY);

    console.log("decodedToken", decodedToken);

    req.user = {
      id: decodedToken?.id,
      email: decodedToken?.email,
    };

    const user = await User.findById(decodedToken?.id);

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
