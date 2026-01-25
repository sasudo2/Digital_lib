const Captain = require('../model/captain.model');
const { validationResult } = require('express-validator');
const captainService = require('../services/captain.service');
const BlacklistToken = require('../model/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  try {
    const isAlreadyCaptain = await Captain.findByEmail(email);
    if (isAlreadyCaptain) {
      return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await Captain.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      vehicleColor: vehicle.color,
      vehiclePlate: vehicle.plate,
      vehicleCapacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    const token = Captain.generateAuthToken(captain.id);
    const { password: _, ...captainWithoutPassword } = captain;
    res.status(201).json({ token, captain: captainWithoutPassword });
  } catch (error) {
    next(error);
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const captain = await Captain.findByEmail(email);
    if (!captain) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await Captain.comparePassword(password, captain.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = Captain.generateAuthToken(captain.id);
    const { password: _, ...captainWithoutPassword } = captain;
    res.cookie('token', token);
    res.status(200).json({ token, captain: captainWithoutPassword });
  } catch (error) {
    next(error);
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  const { password, ...captainWithoutPassword } = req.captain;
  res.status(200).json(captainWithoutPassword);
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      await BlacklistToken.create(token);
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successfully' });
  } catch (err) {
    next(err);
  }
};