const { verifyToken } = require('../middleware/userAuth');
const express = require("express");
const router = express.Router();
const {
  generateSalary,
  updateSalary,
  deleteSalary,
  getSalaryByEmployee,
  downloadSalaryPDF,
  getMonthlyPayrollSummary,
} = require("../controllers/salaryController");
// Create / Generate salary
router.post("/generate", verifyToken, generateSalary);

// Update salary by ID
router.put("/update/:id", verifyToken, updateSalary);

// Delete salary by ID
router.delete("/delete/:id", verifyToken, deleteSalary);

// Get salary slips by employee
router.get("/employee/:employeeId", verifyToken, getSalaryByEmployee);

// Download salary slip PDF
router.get("/pdf/:id", verifyToken, downloadSalaryPDF);

// Monthly payroll summary
router.get("/summary", verifyToken, getMonthlyPayrollSummary);

module.exports = router;
