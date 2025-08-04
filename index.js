const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const database = require("./config/database");
const attendanceRoutes = require("./routes/attendance");
const leaveRoutes = require("./routes/leave");
const salaryRoutes = require("./routes/salary");
const dashboardRoutes = require("./routes/dashboard");
const settingsRoutes = require("./routes/settings");
const bodyParser = require("body-parser");

require("dotenv").config();
database.connect();

const PORT = process.env.PORT || 4000;

// cookie-parser
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies/session
  })
);

// mounting
app.use("/api/v1/", userRoutes);
const employeeRoutes = require("./routes/employee");
app.use("/api/v1/", employeeRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/leave", leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
