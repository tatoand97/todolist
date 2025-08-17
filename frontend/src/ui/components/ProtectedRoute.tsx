import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/store";
import { selectIsAuthenticated } from "../../features/auth/selectors";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = useAppSelector(selectIsAuthenticated);
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
