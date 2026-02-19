const express = require("express");
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("first name must have atleast 3 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters."),

  ],
  captainController.registerCaptain
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("InvlidEmail"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("password must be atleast 6 characters."),
  ],
  captainController.loginCaptain
);

router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

module.exports = router;
