const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Student = require('../models/Student');

// Generate QR code for a student
router.get('/generate/:studentId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const qrData = student.generateQRData();
        const qrCode = await QRCode.toDataURL(qrData);
        
        student.qrCode = qrCode;
        await student.save();

        res.json({ qrCode });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get QR code for a student
router.get('/:studentId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.qrCode) {
            return res.status(404).json({ message: 'QR code not generated yet' });
        }

        res.json({ qrCode: student.qrCode });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify QR code data
router.post('/verify', async (req, res) => {
    try {
        const { qrData } = req.body;
        const data = JSON.parse(qrData);

        const student = await Student.findById(data.id);
        if (!student) {
            return res.status(404).json({ message: 'Invalid QR code' });
        }

        // Verify if the data matches
        if (
            student.name !== data.name ||
            student.email !== data.email ||
            student.rollNumber !== data.rollNumber
        ) {
            return res.status(400).json({ message: 'Invalid QR code data' });
        }

        res.json({ valid: true, student });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Regenerate QR codes for all students
router.post('/regenerate-all', async (req, res) => {
    try {
        const students = await Student.find();
        
        for (const student of students) {
            const qrData = student.generateQRData();
            student.qrCode = await QRCode.toDataURL(qrData);
            await student.save();
        }

        res.json({ message: 'All QR codes regenerated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 