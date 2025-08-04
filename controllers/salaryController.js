const Salary = require("../models/Salary");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const PDFDocument = require("pdfkit"); // npm i pdfkit
const stream = require("stream");

// Generate Salary with attendance calculation and duplicate prevention
exports.generateSalary = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basic,
      allowance = 0,
      deductions = 0,
      totalWorkingDays = 30,
      autoCalculate = false, // If true, calculate presentDays & perDaySalary from attendance
    } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    // Prevent duplicate salary generation
    const exists = await Salary.findOne({ employee: employeeId, month, year });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Salary already generated for this month/year",
      });
    }

    let presentDays = totalWorkingDays;
    let perDaySalary = basic / totalWorkingDays;

    if (autoCalculate) {
      // Calculate presentDays from Attendance collection for this month/year
      const startDate = new Date(
        year,
        new Date(`${month} 1, ${year}`).getMonth(),
        1
      );
      const endDate = new Date(year, startDate.getMonth() + 1, 0);

      const attendanceRecords = await Attendance.find({
        employee: employeeId,
        date: { $gte: startDate, $lte: endDate },
        status: "Present",
      });

      presentDays = attendanceRecords.length;
      perDaySalary = basic / totalWorkingDays;
    }

    const netSalary = perDaySalary * presentDays + allowance - deductions;

    const salary = await Salary.create({
      employee: employeeId,
      month,
      year,
      basic,
      allowance,
      deductions,
      netSalary,
      totalWorkingDays,
      presentDays,
      perDaySalary,
    });

    res.status(201).json({ success: true, salary });
  } catch (err) {
    console.error("Generate Salary Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Salary by ID
exports.updateSalary = async (req, res) => {
  try {
    const salaryId = req.params.id;
    const updates = req.body;

    const salary = await Salary.findByIdAndUpdate(salaryId, updates, {
      new: true,
    });
    if (!salary)
      return res
        .status(404)
        .json({ success: false, message: "Salary record not found" });

    res.status(200).json({ success: true, salary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Salary by ID
exports.deleteSalary = async (req, res) => {
  try {
    const salaryId = req.params.id;

    const salary = await Salary.findByIdAndDelete(salaryId);
    if (!salary)
      return res
        .status(404)
        .json({ success: false, message: "Salary record not found" });

    res.status(200).json({ success: true, message: "Salary record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Salary by Employee
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

// Helper to safely format numbers
function formatCurrency(num) {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  return num.toFixed(2);
}

exports.downloadSalaryPDF = async (req, res) => {
  try {
    const salaryId = req.params.id;

    const salary = await Salary.findById(salaryId).populate("employee");
    if (!salary)
      return res
        .status(404)
        .json({ success: false, message: "Salary record not found" });

    if (!salary.employee || !salary.employee.personalInfo) {
      return res.status(500).json({
        success: false,
        message: "Employee details incomplete for this salary.",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=salary_slip_${salaryId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Pipe pdf stream BEFORE doc.end()
    doc.pipe(res);

    doc.fontSize(20).text("Salary Slip", { align: "center" });
    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Employee Name: ${salary.employee.personalInfo.name}`);
    doc.text(`Month/Year: ${salary.month} / ${salary.year}`);
    doc.text(`Basic Salary: ₹${formatCurrency(salary.basic)}`);
    doc.text(`Allowance: ₹${formatCurrency(salary.allowance)}`);
    doc.text(`Deductions: ₹${formatCurrency(salary.deductions)}`);
    doc.text(`Total Working Days: ${salary.totalWorkingDays || "N/A"}`);
    doc.text(`Present Days: ${salary.presentDays || "N/A"}`);
    doc.text(`Per Day Salary: ₹${formatCurrency(salary.perDaySalary)}`);
    doc.text(`Net Salary: ₹${formatCurrency(salary.netSalary)}`);

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Failed to generate PDF file." });
    }
  }
};

// Monthly Payroll Summary
exports.getMonthlyPayrollSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res
        .status(400)
        .json({ success: false, message: "Month and year are required" });
    }

    // Sum of all netSalary for month and year
    const summary = await Salary.aggregate([
      { $match: { month, year: parseInt(year) } },
      {
        $group: {
          _id: null,
          totalPayout: { $sum: "$netSalary" },
          totalEmployeesPaid: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary.length
        ? summary[0]
        : { totalPayout: 0, totalEmployeesPaid: 0 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
