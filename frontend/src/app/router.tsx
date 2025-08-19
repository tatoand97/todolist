import { createBrowserRouter } from "react-router-dom";
import Login from "../ui/pages/Login";
import Register from "../ui/pages/Register";
import Tasks from "../ui/pages/Tasks";
import Categories from "../ui/pages/Categories";
import TaskDetail from "../ui/pages/TaskDetail";
import ProtectedRoute from "../ui/components/ProtectedRoute";
import AppLayout from "../ui/layouts/AppLayout";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Rutas protegidas con Layout
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Tasks />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Categories />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:id",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <TaskDetail />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);
