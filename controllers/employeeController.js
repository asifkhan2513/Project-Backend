const Employee = require("../models/Employee");

//create employee
exports.createEmployee = async (req, res) => {
  try {
    const email = req.body.personalInfo?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required in personalInfo",
      });
    }

    const existingEmployee = await Employee.findOne({
      "personalInfo.email": email,
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    const newEmployee = new Employee(req.body);
    await newEmployee.save();

    res.status(201).json({ success: true, employee: newEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate Total Employee Count
exports.getEmployeeCount = async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Employee
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// working
exports.updateEmployee = async (req, res) => {
  try {
    // Only admin should be allowed
    if (req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const allowedFields = [
      "personalInfo",
      "bankInfo",
      "nomineeInfo",
      "idDetails",
      "documents",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.log("i am error");
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Employee
// working
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
