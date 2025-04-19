const mongoose = require('mongoose');
const moment = require('moment');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'early-leave'],
        default: 'present'
    },
    duration: {
        type: Number,  // Duration in minutes
        default: 0
    }
}, { timestamps: true });

// Calculate attendance status based on check-in and check-out times
attendanceSchema.pre('save', function(next) {
    const startTime = moment(process.env.ATTENDANCE_START_TIME, 'HH:mm');
    const endTime = moment(process.env.ATTENDANCE_END_TIME, 'HH:mm');
    const checkInTime = moment(this.checkIn);
    
    // Check if late
    if (checkInTime.isAfter(startTime)) {
        this.status = 'late';
    }

    // Calculate duration if checked out
    if (this.checkOut) {
        const checkOutTime = moment(this.checkOut);
        this.duration = checkOutTime.diff(checkInTime, 'minutes');

        // Check if left early
        if (checkOutTime.isBefore(endTime)) {
            this.status = 'early-leave';
        }

        // Mark as absent if duration is less than 4 hours
        if (this.duration < 240) {
            this.status = 'absent';
        }
    }

    next();
});

module.exports = mongoose.model('Attendance', attendanceSchema); 