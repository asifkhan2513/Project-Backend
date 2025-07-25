// auth . is Customer , isAdmin
const jwt = require("jsonwebtoken");
const user = require("../models/User");
require("dotenv");
exports.auth = (req, res, next) => {
  try {
    //extract web form body
    //pending other way of token
    const token =
      req.body.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");
    if (!token || token === undefined) {
      return res.status(404).json({
        success: true,
        message: "Token is missing",
      });
    }
    //verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);
      req.user = payload;
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "token invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "something went wrong while token verifying",
    });
  }
};
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "this protect for  Admin ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};
