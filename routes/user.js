const express = require("express");
const router = express.Router();
const { login, signup, sendotp } = require("../controllers/userController");
const { auth, isAdmin, verifyToken } = require("../middleware/userAuth");

router.post("/auth/login", login);

// Route for user signup
router.post("/auth/signup", signup);

// Route for sending OTP to the user's email
router.post("/auth/sendotp", verifyToken, sendotp);

module.exports = router;
