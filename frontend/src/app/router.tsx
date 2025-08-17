import { createBrowserRouter } from "react-router-dom";
import Login from "../ui/pages/Login";
import Register from "../ui/pages/Register";
import Tasks from "../ui/pages/Tasks";
import Categories from "../ui/pages/Categories";
import TaskDetail from "../ui/pages/TaskDetail";
import ProtectedRoute from "../ui/components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <Login/> },
  { path: "/register", element: <Register/> },
  { path: "/", element: <ProtectedRoute><Tasks/></ProtectedRoute> },
  { path: "/categories", element: <ProtectedRoute><Categories/></ProtectedRoute> },
  { path: "/tasks/:id", element: <ProtectedRoute><TaskDetail/></ProtectedRoute> }
]);
