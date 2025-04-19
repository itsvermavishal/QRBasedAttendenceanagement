# QR Code Attendance System

A modern attendance tracking system built with the MERN stack (MongoDB, Express.js, React, Node.js) that uses QR codes for quick and efficient attendance marking.

## Features

- QR Code based attendance tracking
- Real-time attendance monitoring
- Student and teacher management
- Detailed attendance reports with charts
- Export reports to CSV and PDF
- Responsive Material-UI design
- Secure authentication and authorization

## Tech Stack

- **Frontend:**
  - React 18
  - Material-UI (MUI) v5
  - Chart.js for analytics
  - HTML5 QR Code Scanner
  - Axios for API calls
  - React Router v6

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT Authentication
  - RESTful API

## Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qr-attendance-system.git
cd qr-attendance-system
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
```

4. Create a .env file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. In a separate terminal, start the frontend:
```bash
cd client
npm start
```

3. Access the application at: http://localhost:3000

## Project Structure

```
qr-attendance-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   └── App.js        # Main App component
├── controllers/           # Express route controllers
├── middleware/           # Express middlewares
├── models/              # Mongoose models
├── routes/              # Express routes
└── server.js           # Express app entry point
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Students
- GET /api/students - Get all students
- POST /api/students - Create new student
- PUT /api/students/:id - Update student
- DELETE /api/students/:id - Delete student

### Teachers
- GET /api/teachers - Get all teachers
- POST /api/teachers - Create new teacher
- PUT /api/teachers/:id - Update teacher
- DELETE /api/teachers/:id - Delete teacher

### Attendance
- GET /api/attendance - Get attendance records
- POST /api/attendance - Mark attendance
- GET /api/attendance/report - Get attendance report
- GET /api/attendance/export/csv - Export CSV report
- GET /api/attendance/export/pdf - Export PDF report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the beautiful components
- Chart.js for the analytics visualizations
- HTML5 QR Code Scanner for QR code functionality 