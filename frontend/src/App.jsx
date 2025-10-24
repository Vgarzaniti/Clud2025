import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing_page/LandingPage";
import NotFound from "./pages/not_found/404";
import Home from "./pages/home/index.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<LandingPage />} />
        {/* Ruta del home */}
        <Route path="/home" element={<Home />} />
        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
