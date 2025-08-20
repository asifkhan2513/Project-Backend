// const Attendance = require("../models/Attendance");
// const Employee = require("../models/Employee");

// // Mark Attendance
// // working
// exports.markAttendance = async (req, res) => {
//   try {
//     const { employeeId, status } = req.body;
//     const date = new Date().setHours(0, 0, 0, 0);

//     // Check if employee exists
//     const employee = await Employee.findById(employeeId);
//     if (!employee)
//       return res
//         .status(404)
//         .json({ success: false, message: "Employee not found" });

//     // Check if already marked for today
//     const alreadyMarked = await Attendance.findOne({
//       employee: employeeId,
//       date,
//     });
//     if (alreadyMarked)
//       return res.status(400).json({
//         success: false,
//         message: "Attendance already marked for today",
//       });

//     const attendance = await Attendance.create({
//       employee: employeeId,
//       status,
//       date,
//     });
//     res.status(201).json({ success: true, attendance });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get Attendance Report
// // working
// exports.getAttendanceReport = async (req, res) => {
//   try {
//     const { employeeId } = req.query;

//     if (!employeeId)
//       return res
//         .status(400)
//         .json({ success: false, message: "Employee ID is required" });

//     const records = await Attendance.find({ employee: employeeId }).sort({
//       date: -1,
//     });
//     res.status(200).json({ success: true, records });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// ==================== MARK ATTENDANCE ====================
// exports.markAttendance = async (req, res) => {
//   try {
//     const { employeeId, status } = req.body;
//     const date = new Date().setHours(0, 0, 0, 0);

//     // Check if employee exists
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     // Check if already marked for today
//     const alreadyMarked = await Attendance.findOne({
//       employee: employeeId,
//       date,
//     });
//     if (alreadyMarked) {
//       return res.status(400).json({
//         success: false,
//         message: "Attendance already marked for today",
//       });
//     }

//     // Create attendance
//     const attendance = await Attendance.create({
//       employee: employeeId,
//       status,
//       date,
//     });

//     res.status(201).json({ success: true, attendance });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, status } = req.body;

    if (!employeeId || !status) {
      return res.status(400).json({
        success: false,
        message: "Both employeeId and status are required.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: today },
      { $set: { status: status } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, attendance: attendanceRecord });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Server Error in markAttendance:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An unexpected server error occurred.",
      });
  }
};
// ==================== UPDATE ATTENDANCE ====================
// Update Attendance
// exports.updateAttendance = async (req, res) => {
//   try {
//     const { attendanceId, status } = req.body; // ✅ getting from body instead of params

//     if (!attendanceId || !status) {
//       return res.status(400).json({
//         success: false,
//         message: "attendanceId and status are required",
//       });
//     }

//     const updated = await Attendance.findByIdAndUpdate(
//       attendanceId,
//       { status },
//       { new: true } // return updated doc
//     ).populate("employee");

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Attendance not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Attendance updated successfully",
//       attendance: updated,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// Update Attendance by employeeId + date
exports.updateAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "employeeId, date and status are required",
      });
    }

    // normalize date (so it matches stored date with 00:00:00 time)
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    const updated = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: normalizedDate },
      { status },
      { new: true }
    ).populate("employee");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found for given employee and date",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ATTENDANCE REPORT ====================
// exports.getAttendanceReport = async (req, res) => {
//   try {
//     const { employeeId, month, year } = req.query;

//     if (!employeeId) {
//       return res.status(400).json({
//         success: false,
//         message: "Employee ID is required",
//       });
//     }

//     let query = { employee: employeeId };

//     // Filter by month/year if provided
//     if (month && year) {
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month
//       query.date = { $gte: startDate, $lte: endDate };
//     }

//     const records = await Attendance.find(query).sort({ date: -1 });

//     // Count total present days (and optional half-day as 0.5)
//     let totalPresent = records.filter((r) => r.status === "Present").length;
//     let totalHalfDay = records.filter((r) => r.status === "Half-Day").length;

//     const presentDays = totalPresent + totalHalfDay * 0.5;

//     res.status(200).json({
//       success: true,
//       records,
//       totalPresentDays: presentDays,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.getAttendanceReport = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    let query = { employee: employeeId };

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    // Count total present and half-day
    let totalPresent = records.filter((r) => r.status === "Present").length;
    let totalHalfDay = records.filter((r) => r.status === "Half-Day").length;
    const presentDays = totalPresent + totalHalfDay * 0.5;

    // Count total working days (exclude weekends & holidays)
    const totalWorkingDays = records.filter(
      (r) => r.status !== "Weekend" && r.status !== "Holiday"
    ).length;

    // Calculate absent days
    const totalAbsentDays = totalWorkingDays - presentDays;

    res.status(200).json({
      success: true,
      records,
      totalPresentDays: presentDays,
      totalWorkingDays,
      totalAbsentDays,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Today's Attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.query;

    // Get start and end of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let query = {
      date: { $gte: todayStart, $lte: todayEnd },
    };

    if (employeeId) query.employee = employeeId;

    const records = await Attendance.find(query).populate("employee");

    res.status(200).json({
      success: true,
      records,
      totalMarked: records.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Today's Attendance
// exports.updateTodayAttendance = async (req, res) => {
//   try {
//     const { attendanceId } = req.params;
//     const { status } = req.body;

//     const updated = await Attendance.findByIdAndUpdate(
//       attendanceId,
//       { status },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Attendance record not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       attendance: updated,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// controllers/attendanceController.js
exports.updateTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params; // get from route
    const { status } = req.body;

    if (!employeeId || !status) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and status are required",
      });
    }

    // get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // find today's attendance for employee
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      // if not exists, create new
      attendance = await Attendance.create({
        employee: employeeId,
        date: today,
        status,
      });
    } else {
      // else update
      attendance.status = status;
      await attendance.save();
    }

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getTodayAbsentEmployees = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const absentEmployees = await Attendance.find({
      date: today,
      status: { $ne: "present" },
    }).populate("employee", "email");

    res.json({
      success: true,
      data: absentEmployees.map(a => ({
        email: a.employee.email,
        status: a.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
