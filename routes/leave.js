const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/userAuth');
const {
    applyLeave,
    getAllLeaves,
    getLeavesByEmployee,
    updateLeaveStatus
} = require('../controllers/leaveController');

// Apply Leave
router.post('/apply', verifyToken, applyLeave);

// View All Leaves (Admin)
router.get('/', verifyToken, getAllLeaves);

// View My Leaves
router.get('/mine', verifyToken, getLeavesByEmployee);

// Approve or Reject
router.put('/status/:id', verifyToken, updateLeaveStatus);

module.exports = router;
