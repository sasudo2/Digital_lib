const captainModel = require("../model/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");
const blacklistTokenModel = require("../model/blacklistToken.model");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlready = await captainModel.findOne({ email });
  if (isCaptainAlready) {
    return res.status(401).json({ message: "Caption already exists!" });
  }

  const hashedPassword = await captainModel.hashPassword(password);
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });
  const token = captain.generateAuthToken();
  return res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Captain doesn't exist" });
  }

  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "invalid email or password" });
  }
  const token = captain.generateAuthToken();

  const { password: _, ...captainWithoutPassword } = captain.toObject();

  res.cookie("token", token);
  return res.status(200).json({ token, captainWithoutPassword });
};
module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain);
};
module.exports.captainLogout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      await blacklistTokenModel.create({ token });
    }

    res.status(200).json({ message: "captain logged out" });
  } catch (err) {
    next(err);
  }
};
