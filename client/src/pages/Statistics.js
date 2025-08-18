import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { tasksAPI, categoriesAPI } from '../services/api';

const Statistics = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, categoriesResponse] = await Promise.all([
        tasksAPI.getByUser({}),
        categoriesAPI.getAll()
      ]);
      
      setTasks(tasksResponse.data.items || tasksResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStateStats = () => {
    const stats = {
      'Sin Empezar': 0,
      'Empezada': 0,
      'Finalizada': 0
    };
    
    tasks.forEach(task => {
      const state = task.estado;
      if (stats.hasOwnProperty(state)) {
        stats[state]++;
      }
    });
    
    return stats;
  };

  const getCategoryStats = () => {
    const stats = {};
    const categoryMap = {};
    
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.nombre;
      stats[cat.nombre] = 0;
    });
    
    tasks.forEach(task => {
      const categoryId = task.categoriaId;
      const categoryName = categoryMap[categoryId];
      if (categoryName) {
        stats[categoryName]++;
      }
    });
    
    return stats;
  };

  const stateStats = getStateStats();
  const categoryStats = getCategoryStats();

  const SimpleBarChart = ({ data, title, colors }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(data).map(([key, value], index) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors[index % colors.length],
                  borderRadius: 1
                }}
              />
              <Typography variant="body2" sx={{ minWidth: 100 }}>{key}</Typography>
              <Box
                sx={{
                  flex: 1,
                  height: 20,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${Math.max((value / Math.max(...Object.values(data))) * 100, 5)}%`,
                    backgroundColor: colors[index % colors.length],
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const SimplePieChart = ({ data, title, colors }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: `conic-gradient(${Object.entries(data).map(([key, value], index) => {
                  const percentage = total > 0 ? (value / total) * 100 : 0;
                  return `${colors[index % colors.length]} 0deg ${percentage * 3.6}deg`;
                }).join(', ')})`
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(data).map(([key, value], index) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: colors[index % colors.length],
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="body2">
                  {key}: {value} ({total > 0 ? Math.round((value / total) * 100) : 0}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Cargando estadísticas...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          Estadísticas de Tareas
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SimpleBarChart
            data={stateStats}
            title="Tareas por Estado"
            colors={['#f44336', '#ff9800', '#4caf50']}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <SimplePieChart
            data={stateStats}
            title="Distribución por Estado"
            colors={['#f44336', '#ff9800', '#4caf50']}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SimpleBarChart
            data={categoryStats}
            title="Tareas por Categoría"
            colors={['#2196f3', '#9c27b0', '#00bcd4', '#8bc34a', '#ffc107']}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SimplePieChart
            data={categoryStats}
            title="Distribución por Categoría"
            colors={['#2196f3', '#9c27b0', '#00bcd4', '#8bc34a', '#ffc107']}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Resumen General</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">
              <strong>Total de tareas:</strong> {tasks.length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">
              <strong>Categorías activas:</strong> {categories.length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">
              <strong>Tasa de finalización:</strong> {' '}
              {tasks.length > 0 ? Math.round((stateStats['Finalizada'] / tasks.length) * 100) : 0}%
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Statistics;