const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");

// dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Optional: Role check (admin only)
    if (req.user && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset to 00:00 for date-only comparison

    // 1. Total employees
    const totalEmployees = await Employee.countDocuments();

    // 2. Attendance today
    const todayAttendance = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    //  today absent
    const todayAbsent = await Attendance.countDocuments({
      date: today,
      status: "Absent",
    });

    // today on leave
    const todayOnLeave = await Attendance.countDocuments({
      date: today,
      status: "Leave",
    });

    // 3. Pending leave requests
    const pendingLeaves = await Leave.countDocuments({ status: "Pending" });

    // 4. Monthly payroll stats
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentYear = new Date().getFullYear();

    // monthly payroll
    const monthlyPayrolls = await Salary.countDocuments({
      month: currentMonth,
      year: currentYear,
    });

    // 5. Monthly salary paid
    const totalPaidThisMonth = await Salary.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear,
        },
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$amount" },
        },
      },
    ]);

    // 6. New employees joined this month
    const firstDayOfMonth = new Date(currentYear, new Date().getMonth(), 1);
    const monthlyNewEmployees = await Employee.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        todayAttendance,
        todayAbsent,
        todayOnLeave,
        pendingLeaves,
        monthlyPayrolls,
        totalSalaryPaid: totalPaidThisMonth[0]?.totalSalary || 0,
        monthlyNewEmployees,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
