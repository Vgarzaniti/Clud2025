import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function RutaPrivada() {
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
  if (!usuario || !usuario.id) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  // Autenticado → renderiza rutas hijas
  return <Outlet />;
}

