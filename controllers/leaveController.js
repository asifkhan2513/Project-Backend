const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Apply for Leave
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, fromDate, toDate, reason } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    // over lapping (try  again leave)
    const overlap = await Leave.findOne({
      employee: employeeId,
      status: { $in: ["Pending", "Approved"] },
      $or: [
        {
          fromDate: { $lte: new Date(toDate) },
          toDate: { $gte: new Date(fromDate) },
        },
      ],
    });
    if (overlap) {
      return res.status(400).json({
        success: false,
        message: "An overlapping leave request already exists.",
      });
    }
    
    //create leave
    const leave = await Leave.create({
      employee: employeeId,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Leaves (Admin)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "fullName employeeId email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Leaves of a Specific Employee
exports.getLeavesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const leaves = await Leave.find({ employee: employeeId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Leave Status (Approve/Reject)
console.log("working");
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave)
      return res
        .status(404)
        .json({ success: false, message: "Leave request not found" });

    res.status(200).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
