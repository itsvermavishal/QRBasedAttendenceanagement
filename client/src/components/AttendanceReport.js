import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for the chart
const sampleData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  datasets: [
    {
      label: 'Attendance Percentage',
      data: [85, 92, 88, 95, 90],
      backgroundColor: 'rgba(25, 118, 210, 0.5)',
      borderColor: 'rgba(25, 118, 210, 1)',
      borderWidth: 1,
    },
  ],
};

// Sample attendance data
const sampleAttendance = [
  { date: '2024-01-15', present: 45, total: 50, percentage: '90%' },
  { date: '2024-01-16', present: 48, total: 50, percentage: '96%' },
  { date: '2024-01-17', present: 43, total: 50, percentage: '86%' },
  { date: '2024-01-18', present: 47, total: 50, percentage: '94%' },
  { date: '2024-01-19', present: 46, total: 50, percentage: '92%' },
];

const useStyles = {
  root: {
    flexGrow: 1,
    padding: 2,
  },
  paper: {
    padding: 2,
    marginBottom: 2,
  },
  filters: {
    display: 'flex',
    gap: 2,
    marginBottom: 2,
  },
  exportButtons: {
    display: 'flex',
    gap: 2,
    marginTop: 2,
  },
  status: {
    padding: 1,
    borderRadius: 1,
    textAlign: 'center',
  },
  title: {
    marginBottom: 3,
  },
  chart: {
    marginBottom: 4,
  },
};

const AttendanceReport = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAttendance = useCallback(async () => {
    try {
      const params = {
        startDate,
        endDate,
      };
      if (selectedStudent) {
        params.studentId = selectedStudent;
      }
      const response = await axios.get('http://localhost:5000/api/attendance/report', {
        params,
      });
      setAttendance(response.data);
    } catch (error) {
      setError('Failed to fetch attendance records');
    }
  }, [startDate, endDate, selectedStudent]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAttendance();
    }
  }, [startDate, endDate, selectedStudent, fetchAttendance]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/attendance/export/csv',
        {
          params: {
            startDate,
            endDate,
            studentId: selectedStudent || undefined,
          },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('CSV exported successfully');
    } catch (error) {
      setError('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/attendance/export/pdf',
        {
          params: {
            startDate,
            endDate,
            studentId: selectedStudent || undefined,
          },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('PDF exported successfully');
    } catch (error) {
      setError('Failed to export PDF');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Attendance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Attendance %',
        },
      },
    },
  };

  return (
    <div style={useStyles.root}>
      <Typography variant="h4" sx={useStyles.title}>
        Attendance Report
      </Typography>
      
      <Paper sx={useStyles.paper}>
        <div style={useStyles.chart}>
          <Bar data={sampleData} options={options} />
        </div>
      </Paper>

      <Paper sx={useStyles.paper}>
        <Typography variant="h6" gutterBottom>
          Detailed Report
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Present</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleAttendance.map((row) => (
                <TableRow key={row.date}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.present}</TableCell>
                  <TableCell align="right">{row.total}</TableCell>
                  <TableCell align="right">{row.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={useStyles.paper}>
        <Typography variant="h6" gutterBottom>
          Attendance Report
        </Typography>
        <div style={useStyles.filters}>
          <TextField
            select
            label="Student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            variant="outlined"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Students</MenuItem>
            {students.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                {student.name} ({student.rollNumber})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {moment(record.date).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>{record.student.name}</TableCell>
                    <TableCell>{record.student.rollNumber}</TableCell>
                    <TableCell>
                      {moment(record.checkIn).format('hh:mm A')}
                    </TableCell>
                    <TableCell>
                      {record.checkOut
                        ? moment(record.checkOut).format('hh:mm A')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {record.duration ? `${record.duration} mins` : '-'}
                    </TableCell>
                    <TableCell>
                      <div style={{
                        ...useStyles.status,
                        backgroundColor: record.status === 'present' ? '#4caf50' : '#f44336',
                        color: '#fff'
                      }}>
                        {record.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={attendance.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <div style={useStyles.exportButtons}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AttendanceReport; 