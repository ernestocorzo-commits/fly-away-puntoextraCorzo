import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}