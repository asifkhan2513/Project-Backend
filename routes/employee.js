const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Middleware for authentication (you already have userAuth.js)
const { verifyToken } = require("../middleware/userAuth");

// All routes below are protected

router.post("/employees", verifyToken, createEmployee); // Add employee
router.get("/employees", verifyToken, getAllEmployees); // View all employees
router.get("/employees/:id", verifyToken, getEmployeeById); // View single employee
router.put("/employees/:id", verifyToken, updateEmployee); // Update employee
router.delete("/employees/:id", verifyToken, deleteEmployee); // Delete employee

module.exports = router;
