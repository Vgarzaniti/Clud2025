import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { usuario, loading } = useAuth();

  // Mientras se valida la sesión
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Verificando sesión...
      </div>
    );
  }

  // No autenticado → login
  if (!usuario) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  // Autenticado → renderiza rutas hijas
  return <Outlet />;
}

