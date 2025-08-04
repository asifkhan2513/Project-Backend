
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    dob: String,
    gender: String,
    address: String
  },
  bankInfo: {
    accountNumber: String,
    ifsc: String,
    bankName: String,
    branch: String
  },
  nomineeInfo: {
    name: String,
    relation: String,
    contact: String
  },
  idDetails: {
    aadhaar: String,
    pan: String,
    voterId: String
  },
  documents: {
    resume: String,
    offerLetter: String,
    joiningLetter: String,
    experienceLetter: String,
    idCard: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);