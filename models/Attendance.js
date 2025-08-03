const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0),
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave', 'Half', 'Weekend', 'Holiday'],
        required: true
    }
}, { timestamps: true });

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
