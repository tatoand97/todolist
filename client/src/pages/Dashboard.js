import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Fab,
  Alert,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI, tasksAPI } from '../services/api';
import TaskList from '../components/TaskList';
import TaskDialog from '../components/TaskDialog';
import CategoryDialog from '../components/CategoryDialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [filterState, filterCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, categoriesResponse] = await Promise.all([
        tasksAPI.getByUser({ categoriaId: filterCategory, estado: filterState }),
        categoriesAPI.getAll()
      ]);
      
      setTasks(tasksResponse.data.items || tasksResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (selectedTask) {
        await tasksAPI.update(selectedTask.ID || selectedTask.id, taskData);
      } else {
        await tasksAPI.create(taskData);
      }
      await loadData();
      setTaskDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      setError('Error al guardar la tarea');
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      await loadData();
    } catch (error) {
      setError('Error al eliminar la tarea');
    }
  };

  const handleCategorySave = async (categoryData) => {
    try {
      await categoriesAPI.create(categoryData);
      await loadData();
      setCategoryDialogOpen(false);
    } catch (error) {
      setError('Error al guardar la categoría');
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => (task.State || task.state) === 'Finalizada').length;
    const inProgress = tasks.filter(task => (task.State || task.state) === 'Empezada').length;
    const pending = tasks.filter(task => (task.State || task.state) === 'Sin Empezar').length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Dashboard de Tareas
        </Typography>
        <Button
          variant="outlined"
          startIcon={<BarChartIcon />}
          onClick={() => navigate('/statistics')}
        >
          Ver Estadísticas
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2">Total</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              {stats.pending}
            </Typography>
            <Typography variant="body2">Sin Empezar</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              {stats.inProgress}
            </Typography>
            <Typography variant="body2">Empezada</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {stats.completed}
            </Typography>
            <Typography variant="body2">Finalizada</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="subtitle1">Filtros:</Typography>
          <Button
            variant={filterState === '' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilterState('')}
          >
            Todas
          </Button>
          <Button
            variant={filterState === 'Sin Empezar' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilterState('Sin Empezar')}
          >
            Sin Empezar
          </Button>
          <Button
            variant={filterState === 'Empezada' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilterState('Empezada')}
          >
            Empezada
          </Button>
          <Button
            variant={filterState === 'Finalizada' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilterState('Finalizada')}
          >
            Finalizada
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setCategoryDialogOpen(true)}
          >
            Nueva Categoría
          </Button>
        </Box>
      </Paper>

      {/* Lista de tareas */}
      <TaskList
        tasks={tasks}
        categories={categories}
        loading={loading}
        onEdit={(task) => {
          setSelectedTask(task);
          setTaskDialogOpen(true);
        }}
        onDelete={handleTaskDelete}
      />

      {/* FAB para nueva tarea */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setTaskDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Diálogos */}
      <TaskDialog
        open={taskDialogOpen}
        onClose={() => {
          setTaskDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSave}
        task={selectedTask}
        categories={categories}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onSave={handleCategorySave}
      />
    </Box>
  );
};

export default Dashboard;