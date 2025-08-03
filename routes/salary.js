const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/userAuth');
const {
    generateSalary,
    getSalaryByEmployee
} = require('../controllers/salaryController');

router.post('/generate', verifyToken, generateSalary);
router.get('/:employeeId', verifyToken, getSalaryByEmployee);

module.exports = router;
