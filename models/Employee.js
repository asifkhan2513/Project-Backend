const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      dob: String,
      gender: String,
      address: String,
    },
    bankInfo: {
      accountHolderName: { type: String, required: true },
      accountNumber: String,
      ifsc: String,
      bankName: String,
      branch: String,
    },
    nomineeInfo: {
      name: String,
      relation: String,
      contact: String,
    },
    jobInfo: {
      companyName: { type: String },
      jobTitle: { type: String },
      joiningDate: { type: String },
      salary: { type: String },
      experience: { type: String },
      address: { type: String },
      branch: { type: String },
      department: { type: String },
      netsalary: { type: String },
      designation: { type: String },
    },

    idDetails: {},
    documents: {
      resume: String,
      offerLetter: String,
      joiningLetter: String,
      experienceLetter: String,
      aadhaar: String,
      pan: String,
      photo: String,
      bankProof: String,
      policeVerification: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
