const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

// Generate Salary
exports.generateSalary = async (req, res) => {
  try {
    const { employeeId, month, year, basic, allowance, deductions } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    const netSalary = basic + allowance - deductions;

    const salary = await Salary.create({
      employee: employeeId,
      month,
      year,
      basic,
      allowance,
      deductions,
      netSalary,
    });

    res.status(201).json({ success: true, salary });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Salary already generated for this month/year",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Salary Slips for Employee
exports.getSalaryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const salaryRecords = await Salary.find({ employee: employeeId }).sort({
      year: -1,
      month: -1,
    });
    res.status(200).json({ success: true, salaryRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
