// ./config/database.js
const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  try {
   
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    
    console.log(` MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { connect }; // ✅ Export as object with `connect`
