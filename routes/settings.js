const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/userAuth");
const {
  updateProfile,
  changePassword,
} = require("../controllers/settingsController");

// Update profile
router.put("/profile", verifyToken, updateProfile);

// Change password
router.put("/password", verifyToken, changePassword);

module.exports = router;
