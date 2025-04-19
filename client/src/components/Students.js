import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Typography,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    year: '',
    branch: '',
    semester: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setFormData(student);
      setSelectedStudent(student);
    } else {
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        year: '',
        branch: '',
        semester: '',
      });
      setSelectedStudent(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedStudent) {
        await axios.put(`http://localhost:5000/api/students/${selectedStudent._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/students', formData);
      }
      fetchStudents();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      setError('Failed to delete student');
    }
  };

  const handleShowQR = async (student) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/qr/${student._id}`);
      setSelectedStudent({ ...student, qrCode: response.data.qrCode });
      setOpenQRDialog(true);
    } catch (error) {
      setError('Failed to fetch QR code');
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Students
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ marginBottom: 2 }}
        onClick={() => handleOpenDialog()}
      >
        Add Student
      </Button>

      <Paper sx={{ width: '100%', marginBottom: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(student)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(student._id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleShowQR(student)}>
                        <QrCodeIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="rollNumber"
            label="Roll Number"
            type="text"
            fullWidth
            value={formData.rollNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="year"
            label="Year"
            type="number"
            fullWidth
            value={formData.year}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="branch"
            label="Branch"
            type="text"
            fullWidth
            value={formData.branch}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="semester"
            label="Semester"
            type="number"
            fullWidth
            value={formData.semester}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)}>
        <DialogTitle>QR Code - {selectedStudent?.name}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {selectedStudent?.qrCode && (
            <img
              src={selectedStudent.qrCode}
              alt="QR Code"
              style={{ margin: 16, maxWidth: '100%' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Students; 