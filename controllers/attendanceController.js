const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark Attendance
// working
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, status } = req.body;
    const date = new Date().setHours(0, 0, 0, 0);

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    // Check if already marked for today
    const alreadyMarked = await Attendance.findOne({
      employee: employeeId,
      date,
    });
    if (alreadyMarked)
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
      });

    const attendance = await Attendance.create({
      employee: employeeId,
      status,
      date,
    });
    res.status(201).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendance Report
// working
exports.getAttendanceReport = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId)
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });

    const records = await Attendance.find({ employee: employeeId }).sort({
      date: -1,
    });
    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
