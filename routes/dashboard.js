const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/userAuth");
const { getDashboardStats } = require("../controllers/dashboardController");

router.get("/overview", verifyToken, getDashboardStats);

module.exports = router;
