const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const database = require("./config/database");

require("dotenv").config();
database.connect();

const PORT = process.env.PORT || 4000;

// cookie-parser

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

// app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies/session
  })
);

// mounting
app.use("/api/v1", userRoutes);
// app.use('/api/profile', require('./routes/profileRoutes'));
// const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
