const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");

// working
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    const pendingLeaves = await Leave.countDocuments({ status: "Pending" });

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentYear = new Date().getFullYear();
    const monthlyPayrolls = await Salary.countDocuments({
      month: currentMonth,
      year: currentYear,
    });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        todayAttendance,
        pendingLeaves,
        monthlyPayrolls,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
