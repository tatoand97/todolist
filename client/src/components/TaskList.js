import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskList = ({ tasks, categories, loading, onEdit, onDelete }) => {
  const getStateColor = (state) => {
    switch (state) {
      case 'Sin Empezar': return 'error';
      case 'Empezada': return 'warning';
      case 'Finalizada': return 'success';
      default: return 'default';
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No hay tareas disponibles
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Haz clic en el botón + para crear tu primera tarea
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {tasks.map((task, index) => (
          <ListItem
            key={task.ID || task.id}
            divider={index < tasks.length - 1}
            sx={{ py: 2 }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" component="span">
                    {task.Text || task.text}
                  </Typography>
                  <Chip
                    label={task.State || task.state}
                    color={getStateColor(task.State || task.state)}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Categoría: {getCategoryName(task.CategoryID || task.category_id)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha límite: {formatDate(task.DueDate || task.due_date)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Creada: {formatDate(task.CreatedAt || task.created_at)}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEdit(task)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(task.ID || task.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TaskList;