import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import TaskIcon from '@mui/icons-material/Task';
import PersonIcon from '@mui/icons-material/Person';
import ProfileDialog from './ProfileDialog';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setProfileDialogOpen(true);
    setAnchorEl(null);
  };

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <TaskIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Bienvenido, {user.username || 'Usuario'}
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar 
                src={user.avatarUrl} 
                alt={user.username}
                sx={{ width: 32, height: 32 }}
              >
                {!user.avatarUrl && <PersonIcon />}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfileClick}>
                <PersonIcon sx={{ mr: 1 }} /> Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {location.pathname !== '/login' && (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
            )}
            {location.pathname !== '/register' && (
              <Button color="inherit" onClick={() => navigate('/register')}>
                Registrarse
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
    
    <ProfileDialog 
      open={profileDialogOpen}
      onClose={() => setProfileDialogOpen(false)}
    />
  </>
  );
};

export default Navbar;