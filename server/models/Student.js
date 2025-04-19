const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    qrCode: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Generate QR code data
studentSchema.methods.generateQRData = function() {
    return JSON.stringify({
        id: this._id,
        name: this.name,
        email: this.email,
        rollNumber: this.rollNumber,
        year: this.year,
        branch: this.branch,
        semester: this.semester
    });
};

module.exports = mongoose.model('Student', studentSchema); 