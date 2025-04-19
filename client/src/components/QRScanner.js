import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    try {
      // Here you would typically make an API call to record attendance
      console.log('QR Code scanned:', decodedText);
      setNotification({
        open: true,
        message: 'Attendance recorded successfully!',
        severity: 'success',
      });
      setScanning(false);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to record attendance',
        severity: 'error',
      });
    }
  };

  const onScanError = (error) => {
    console.warn(error);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleResume = () => {
    window.location.reload(); // Reload the component to restart scanning
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        minHeight: '100vh',
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ marginBottom: 3 }}
      >
        QR Scanner
      </Typography>
      <Paper 
        elevation={3} 
        sx={{
          width: '100%',
          maxWidth: 500,
          marginTop: 3,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {scanning ? (
          <div id="reader" style={{ width: '100%' }} />
        ) : (
          <Box sx={{ textAlign: 'center', padding: 4 }}>
            <Typography variant="h6" gutterBottom>
              QR Code Scanned Successfully
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResume}
              sx={{ mt: 2 }}
            >
              Scan Another
            </Button>
          </Box>
        )}
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QRScanner; 