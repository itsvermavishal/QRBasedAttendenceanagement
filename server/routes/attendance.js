const express = require('express');
const router = express.Router();
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance (check-in)
router.post('/check-in', async (req, res) => {
    try {
        const { studentId } = req.body;
        const today = moment().startOf('day');

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if attendance already marked for today
        let attendance = await Attendance.findOne({
            student: studentId,
            date: today.toDate()
        });

        if (attendance) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        // Create new attendance record
        attendance = new Attendance({
            student: studentId,
            date: today.toDate(),
            checkIn: new Date()
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark attendance (check-out)
router.post('/check-out', async (req, res) => {
    try {
        const { studentId } = req.body;
        const today = moment().startOf('day');

        // Find today's attendance record
        const attendance = await Attendance.findOne({
            student: studentId,
            date: today.toDate()
        });

        if (!attendance) {
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out' });
        }

        attendance.checkOut = new Date();
        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attendance by date range
router.get('/report', async (req, res) => {
    try {
        const { startDate, endDate, studentId } = req.query;
        const query = {
            date: {
                $gte: moment(startDate).startOf('day').toDate(),
                $lte: moment(endDate).endOf('day').toDate()
            }
        };

        if (studentId) {
            query.student = studentId;
        }

        const attendance = await Attendance.find(query)
            .populate('student', 'name rollNumber')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Export attendance as CSV
router.get('/export/csv', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const attendance = await Attendance.find({
            date: {
                $gte: moment(startDate).startOf('day').toDate(),
                $lte: moment(endDate).endOf('day').toDate()
            }
        }).populate('student', 'name rollNumber');

        const csvWriter = createCsvWriter({
            path: 'attendance.csv',
            header: [
                { id: 'date', title: 'Date' },
                { id: 'studentName', title: 'Student Name' },
                { id: 'rollNumber', title: 'Roll Number' },
                { id: 'checkIn', title: 'Check In' },
                { id: 'checkOut', title: 'Check Out' },
                { id: 'status', title: 'Status' },
                { id: 'duration', title: 'Duration (minutes)' }
            ]
        });

        const records = attendance.map(record => ({
            date: moment(record.date).format('YYYY-MM-DD'),
            studentName: record.student.name,
            rollNumber: record.student.rollNumber,
            checkIn: moment(record.checkIn).format('HH:mm:ss'),
            checkOut: record.checkOut ? moment(record.checkOut).format('HH:mm:ss') : 'N/A',
            status: record.status,
            duration: record.duration
        }));

        await csvWriter.writeRecords(records);
        res.download('attendance.csv');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Export attendance as PDF
router.get('/export/pdf', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const attendance = await Attendance.find({
            date: {
                $gte: moment(startDate).startOf('day').toDate(),
                $lte: moment(endDate).endOf('day').toDate()
            }
        }).populate('student', 'name rollNumber');

        const doc = new PDFDocument();
        const filename = 'attendance.pdf';

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text('Attendance Report', { align: 'center' });
        doc.moveDown();

        // Add date range
        doc.fontSize(12).text(`Period: ${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}`);
        doc.moveDown();

        // Add table headers
        const tableTop = 150;
        const columnSpacing = 100;
        
        doc.fontSize(10)
            .text('Date', 50, tableTop)
            .text('Name', 150, tableTop)
            .text('Roll No', 250, tableTop)
            .text('Status', 350, tableTop)
            .text('Duration', 450, tableTop);

        let y = tableTop + 20;

        // Add records
        attendance.forEach(record => {
            if (y > 700) {
                doc.addPage();
                y = 50;
            }

            doc.fontSize(10)
                .text(moment(record.date).format('YYYY-MM-DD'), 50, y)
                .text(record.student.name, 150, y)
                .text(record.student.rollNumber, 250, y)
                .text(record.status, 350, y)
                .text(`${record.duration} mins`, 450, y);

            y += 20;
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attendance statistics
router.get('/stats', async (req, res) => {
    try {
        const { studentId, month, year } = req.query;
        const startDate = moment(`${year}-${month}-01`).startOf('month');
        const endDate = moment(startDate).endOf('month');

        const attendance = await Attendance.find({
            student: studentId,
            date: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            }
        });

        const totalDays = endDate.diff(startDate, 'days') + 1;
        const presentDays = attendance.filter(a => a.status === 'present').length;
        const lateDays = attendance.filter(a => a.status === 'late').length;
        const earlyLeaveDays = attendance.filter(a => a.status === 'early-leave').length;
        const absentDays = attendance.filter(a => a.status === 'absent').length;

        const stats = {
            totalDays,
            presentDays,
            lateDays,
            earlyLeaveDays,
            absentDays,
            attendancePercentage: ((presentDays / totalDays) * 100).toFixed(2)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 