import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

const CategoryDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ nombre: '', descripcion: '' });
  };

  const handleClose = () => {
    setFormData({ nombre: '', descripcion: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Categoría</DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la categoría"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Crear
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CategoryDialog;