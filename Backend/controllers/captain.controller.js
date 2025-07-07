const captainModel = require("../model/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");

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
