const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");

require("dotenv");
//sign up
exports.signup = async (req, res) => {
  try {
    console.log("working good");
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    console.log("working good");
    //checking id the already exit
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "User already exist",
      });
    }
    // console.log(password);
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing",
      });
    }
    // create a entry for new user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });
    return res.status(200).json({
      success: true,
      message: "USer Entry Succesful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "user can't be registered, please try again later",
    });
  }
};

exports.login = async (req, res) => {
  try {
    // data fetch
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please fill the all details carefully",
      });
    }
    //check for registerd user
    let user = await User.findOne({ email });
    // if not registerd
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    // verify password and generate a jwt token
    if (await bcrypt.compare(password, user.password)) {
      // password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.toObject();
      user.token = token;

      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "user logged succefully",
      });
    } else {
      //password do not match
      return res.status(403).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Login Failure",
    });
  }
};

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);

    var result = await OTP.findOne({ otp: otp });
    console.log("working fine");

    var result = await OTP.findOne({ email: email });

    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }
    // create an entry for otp
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
