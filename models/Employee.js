// const mongoose = require("mongoose");

// const employeeSchema = new mongoose.Schema(
//   {
//     personalInfo: {
//       name: { type: String, required: true },
//       fatherName: String,
//       dob: Date,
//       gender: { type: String, enum: ["Male", "Female", "Other"] },
//       email: { type: String, required: true, unique: true },
//       contactNumber: String,
//       emergencyContact: String,
//       address: String,
//       permanentAddress: String,
//     },
//     employmentDetails: {
//       department: String,
//       designation: String,
//       employeeType: {
//         type: String,
//         enum: ["Full-Time", "Part-Time", "Intern", "Contract"],
//         default: "Full-Time",
//       },
//       joiningDate: Date,
//     },
//     bankDetails: {
//       accountHolderName: String,
//       accountNumber: String,
//       ifscCode: String,
//       bankName: String,
//     },
//     nomineeDetails: {
//       nomineeName: String,
//       relation: String,
//       contactNumber: String,
//     },
//     idDetails: {
//       aadharNumber: String,
//       panNumber: String,
//     },
//     documents: {
//       resumeUrl: String,
//       photoUrl: String,
//       aadharUrl: String,
//       panUrl: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Employee", employeeSchema);




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