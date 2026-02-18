const User = require('../model/user.model');
const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const BlacklistToken = require('../model/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password } = req.body;
  
  try {
    const isAlreadyUser = await User.findByEmail(email);
    if (isAlreadyUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists.', 
        alert: true, 
        alertType: 'danger' 
      });
    }
    
    const hashedPassword = await User.hashPassword(password);
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });
    
    const token = User.generateAuthToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    const token = User.generateAuthToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    res.cookie('token', token);
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserProfile = (req, res, next) => {
  console.log("from user controller",req.user);
  alert(req.user);
  const { password, ...userWithoutPassword } = req.user;
  res.status(200).json(userWithoutPassword);
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      await BlacklistToken.create(token);
    }
    res.status(200).json({ message: 'logged out' });
  } catch (err) {
    next(err);
  }
};