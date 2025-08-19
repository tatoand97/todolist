# Task Manager - Cliente React

Cliente web desarrollado en React con Material UI para la API de gestión de tareas.

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript
- **Material UI (MUI)** - Componentes de interfaz
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.js       # Barra de navegación
│   ├── ProtectedRoute.js # Rutas protegidas
│   ├── TaskList.js     # Lista de tareas
│   ├── TaskDialog.js   # Modal para tareas
│   └── CategoryDialog.js # Modal para categorías
├── contexts/           # Contextos de React
│   └── AuthContext.js  # Contexto de autenticación
├── pages/              # Páginas principales
│   ├── Login.js        # Página de login
│   ├── Register.js     # Página de registro
│   ├── Dashboard.js    # Dashboard principal
│   └── Statistics.js   # Vista de estadísticas
├── services/           # Servicios API
│   └── api.js          # Cliente Axios
├── App.js              # Componente principal
└── index.js            # Punto de entrada
```

## 🔧 Configuración

La aplicación se conecta automáticamente al backend en `http://localhost:8080` mediante proxy configurado en `package.json`.

## 📱 Funcionalidades

- **Autenticación**: Login y registro de usuarios
- **Dashboard**: Vista general con estadísticas básicas
- **Gestión de Tareas**: CRUD completo con estados (Sin Empezar, Empezada, Finalizada)
- **Categorías**: Creación y asignación a tareas
- **Filtros**: Por estado y categoría con recarga automática
- **Estadísticas**: Vista detallada con gráficos de barras y circulares
- **Visualización de datos**: Distribución por estado y categoría
- **Responsive**: Adaptado a dispositivos móviles

## 🎨 Interfaz

- **Material Design**: Componentes consistentes
- **Gráficos CSS**: Visualizaciones sin dependencias externas
- **Navegación intuitiva**: Rutas protegidas con React Router
- **Feedback visual**: Alertas, estados de carga y validaciones
- **Filtros dinámicos**: Botones de estado con actualización automática