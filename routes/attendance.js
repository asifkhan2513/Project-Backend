const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/userAuth");
const {
  markAttendance,
  getAttendanceReport,
  updateAttendance,
  getTodayAttendance,
  updateTodayAttendance,
  getTodayAbsentEmployees,
} = require("../controllers/attendanceController");

router.post("/mark", verifyToken, markAttendance);
router.get("/report", verifyToken, getAttendanceReport);
router.put("/update", verifyToken, updateAttendance);
router.get("/today", verifyToken, getTodayAttendance);
router.put("/today/:employeeId", verifyToken, updateTodayAttendance);
router.get("/absent-today", verifyToken, getTodayAbsentEmployees);

module.exports = router;
