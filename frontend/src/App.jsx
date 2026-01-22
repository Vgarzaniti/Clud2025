import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RutaPrivada from "./components/RutaPrivada.jsx";

import Home from "./pages/Home.jsx"
import Carreras from "./pages/Carreras.jsx";
import Materia from "./pages/Materia.jsx";
import ForoDetalle from "./pages/ForoDetalle.jsx";
import Perfil from "./pages/Perfil.jsx";
import Ayuda from "./pages/Ayuda.jsx";
import Inicio from "./pages/Inicio.jsx";
import InicioSesion from "./pages/InicioSesion.jsx";
import Registrar from "./pages/Registrar.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import OlvidarContrasena from "./pages/OlvidarContraseña.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio-sesion" element={<InicioSesion />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/olvidar-contrasena" element={<OlvidarContrasena />} />
        </Route>
        
        {/* Rutas protegidas */}
        <Route element={<RutaPrivada />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/carreras" element={<Carreras />} />
            <Route path="/materia/:nombre" element={<Materia />} />
            <Route path="/foro/:foroId" element={<ForoDetalle />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ayuda" element={<Ayuda />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
