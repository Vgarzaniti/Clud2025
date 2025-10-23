import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx"
import Encabezado from "./components/Encabezado.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-fondo text-texto">
        <Encabezado />
        <Routes>
          <Route path="/" element={<Inicio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
