const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  const isBlacklisted = await userModel.findOne({ token: token });
  if (isBlacklisted) {
    res.status(401).json({ message: "Unauthorized" });
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
