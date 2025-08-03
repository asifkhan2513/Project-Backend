const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/userAuth");
const {
  markAttendance,
  getAttendanceReport,
} = require("../controllers/attendanceController");

router.post("/mark", verifyToken, markAttendance);
router.get("/report", verifyToken, getAttendanceReport);

module.exports = router;
