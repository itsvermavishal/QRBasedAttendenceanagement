const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const QRCode = require('qrcode');
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new student
router.post('/', [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('rollNumber').notEmpty(),
    check('year').isNumeric(),
    check('branch').notEmpty(),
    check('semester').isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, rollNumber, year, branch, semester } = req.body;

        // Check if student already exists
        let student = await Student.findOne({ $or: [{ email }, { rollNumber }] });
        if (student) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Create new student
        student = new Student({
            name,
            email,
            rollNumber,
            year,
            branch,
            semester
        });

        // Generate QR code
        const qrData = student.generateQRData();
        student.qrCode = await QRCode.toDataURL(qrData);

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update student
router.put('/:id', [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('rollNumber').notEmpty(),
    check('year').isNumeric(),
    check('branch').notEmpty(),
    check('semester').isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, rollNumber, year, branch, semester } = req.body;

        // Check if student exists
        let student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student
        student.name = name;
        student.email = email;
        student.rollNumber = rollNumber;
        student.year = year;
        student.branch = branch;
        student.semester = semester;

        // Regenerate QR code
        const qrData = student.generateQRData();
        student.qrCode = await QRCode.toDataURL(qrData);

        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.remove();
        res.json({ message: 'Student removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 