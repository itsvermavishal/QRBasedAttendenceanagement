import React from 'react';
import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Today as TodayIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const summaryCards = [
    {
      title: 'Total Students',
      value: '150',
      icon: <PeopleIcon sx={{ fontSize: 40, marginBottom: 2, color: 'primary.main' }} />,
    },
    {
      title: 'Today\'s Attendance',
      value: '85%',
      icon: <TodayIcon sx={{ fontSize: 40, marginBottom: 2, color: 'primary.main' }} />,
    },
    {
      title: 'Monthly Average',
      value: '92%',
      icon: <AssessmentIcon sx={{ fontSize: 40, marginBottom: 2, color: 'primary.main' }} />,
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={4} key={card.title}>
            <Paper 
              sx={{ 
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }} 
              elevation={3}
            >
              {card.icon}
              <Typography variant="h6" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="h4" color="primary">
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard; 