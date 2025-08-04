const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Casual", "Sick", "Earned", "Unpaid"],
      default: "Casual",
    },
    reason: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    adminComment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
