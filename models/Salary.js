const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    basic: Number,
    allowance: Number,
    deductions: Number,
    netSalary: Number,
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
