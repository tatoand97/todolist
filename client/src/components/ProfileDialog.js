import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';

const ProfileDialog = ({ open, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open && user) {
      setAvatarUrl(user.avatarUrl || '');
      setError('');
      setSuccess('');
    }
  }, [open, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateProfile({ avatarUrl });
    
    if (result.success) {
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Perfil de Usuario</DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar 
              src={avatarUrl} 
              alt={user?.username}
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              {!avatarUrl && <PersonIcon sx={{ fontSize: 40 }} />}
            </Avatar>
            <Typography variant="h6">{user?.username}</Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            label="URL del Avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            margin="normal"
            placeholder="https://ejemplo.com/mi-avatar.jpg"
            helperText="Ingresa la URL de tu imagen de avatar"
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ProfileDialog;