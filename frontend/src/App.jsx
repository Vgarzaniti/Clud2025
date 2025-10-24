import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx"
import Encabezado from "./components/Encabezado.jsx";
import Carreras from "./pages/Carreras.jsx";
import Materia from "./pages/Materia.jsx";
import ForoDetalle from "./pages/ForoDetalle.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-fondo text-texto">
        <Encabezado />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/carreras" element={<Carreras />} />
          <Route path="/materia/:nombre" element={<Materia />} />
          <Route path="/foro/:id" element={<ForoDetalle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
