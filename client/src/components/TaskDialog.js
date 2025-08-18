import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const TaskDialog = ({ open, onClose, onSave, task, categories }) => {
  const [formData, setFormData] = useState({
    texto: '',
    fechaTentativaFin: '',
    estado: 'Sin Empezar',
    idCategoria: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        texto: task.Text || task.text || '',
        fechaTentativaFin: (task.DueDate || task.due_date) ? (task.DueDate || task.due_date).split('T')[0] : '',
        estado: task.State || task.state || 'Sin Empezar',
        idCategoria: task.CategoryID || task.category_id || ''
      });
    } else {
      setFormData({
        texto: '',
        fechaTentativaFin: '',
        estado: 'Sin Empezar',
        idCategoria: categories.length > 0 ? (categories[0].ID || categories[0].id) : ''
      });
    }
  }, [task, categories, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      fechaTentativaFin: formData.fechaTentativaFin ? 
        new Date(formData.fechaTentativaFin + 'T23:59:59Z').toISOString() : null
    };
    onSave(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {task ? 'Editar Tarea' : 'Nueva Tarea'}
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Descripción de la tarea"
            name="texto"
            value={formData.texto}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={3}
          />
          
          <TextField
            fullWidth
            label="Fecha límite"
            name="fechaTentativaFin"
            type="date"
            value={formData.fechaTentativaFin}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value="Sin Empezar">Sin Empezar</MenuItem>
              <MenuItem value="Empezada">Empezada</MenuItem>
              <MenuItem value="Finalizada">Finalizada</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="idCategoria"
              value={formData.idCategoria}
              onChange={handleChange}
              label="Categoría"
            >
              {categories.map((category) => (
                <MenuItem key={category.ID || category.id} value={category.ID || category.id}>
                  {category.Name || category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {task ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TaskDialog;