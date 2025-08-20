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


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = { verifyToken };

// middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT Token
 */

// const verifyToken = (req, res, next) => {
//   try {
//     // Check if Authorization header exists
//     const authHeader = req.headers["authorization"];
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: No token provided" });
//     }

//     // Extract token from header
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach decoded user info to request object
//     req.user = decoded;

//     // Continue to next middleware/controller
//     next();
//   } catch (err) {
//     console.error("JWT Verification Error:", err.message);
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: Token is invalid or expired",
//     });
//   }
// };

module.exports = { verifyToken };
