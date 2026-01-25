const User = require('../model/user.model');
const Captain = require('../model/captain.model');
const BlacklistToken = require('../model/blacklistToken.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const isBlacklisted = await BlacklistToken.findByToken(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const isBlacklisted = await BlacklistToken.findByToken(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await Captain.findById(decoded.id);

    if (!captain) {
      return res.status(401).json({ message: 'Unauthorized - Captain not found' });
    }

    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};