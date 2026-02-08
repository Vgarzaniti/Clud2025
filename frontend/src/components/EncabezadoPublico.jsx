import { Link, useLocation } from "react-router-dom";

export default function EncabezadoPublico() {
  const location = useLocation();

  return (
    <nav className="bg-panel text-white border-b border-gray-700 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-xl font-semibold">
          Foro Institucional UTN
        </Link>

        <div className="flex gap-4 items-center">

          <Link
            to="/inicio-sesion"
            className={`text-white px-4 py-2 rounded-full transition 
              ${location.pathname === "/inicio-sesion" 
                ? "bg-red-700 shadow-lg scale-105"
                : "bg-red-600 hover:bg-red-800"
            }`}
          >
            Iniciar sesión
          </Link>

          <Link 
            to="/registrar" 
            className={`text-white px-4 py-2 rounded-full transition 
              ${ location.pathname === "/registrar" 
                ? "bg-blue-700 shadow-lg scale-105"
                : "bg-blue-600 hover:bg-blue-800"
            }`}
          >
            Registrarse
          </Link>

        </div>
      </div>
    </nav>
  );
}
