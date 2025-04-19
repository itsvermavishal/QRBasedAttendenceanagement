import React from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  CssBaseline,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  QrCode,
  Assessment,
  Logout,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  marginLeft: drawerWidth,
}));

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Students', icon: <People />, path: '/students' },
  { text: 'QR Scanner', icon: <QrCode />, path: '/scanner' },
  { text: 'Attendance Report', icon: <Assessment />, path: '/attendance' },
  { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <MuiToolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            QR Attendance System
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </MuiToolbar>
      </StyledAppBar>
      <StyledDrawer variant="permanent">
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : undefined }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      <MainContent>
        <Toolbar />
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      </MainContent>
    </Box>
  );
};

export default Layout; 