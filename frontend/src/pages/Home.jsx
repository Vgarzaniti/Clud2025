import { useState, useEffect } from "react";
import BarraLado from "../components/BarraLado.jsx";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";
import { foroService } from "../services/foroService.js";
import "../input.css";

export default function Home() {
  const [mostrarForo, setMostrarForo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [foros, setForos] = useState([]);
  const [carga, setCarga] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const cargarForos = async () => {
      try {
        const data = await foroService.obtenerTodos();
        
        const forosOrdenados = data
          .filter((foro) => foro.fecha_creacion)
          .sort(
            (a, b) =>
              new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
          );

        setForos(forosOrdenados);

      }catch (error) {
        setError("Error al cargar los foros:", error);
      }finally{
        setCarga(false);
      }
    };

    cargarForos();
  }, [])

  const foroBuscador = foros.filter((foro) => 
    (foro.pregunta || "").toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6 flex gap-6">
      <BarraLado />
      <main className="flex-1 space-y-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar Foro"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} 
            className="bg-panel border border-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg flex-1"
          />
          <button 
            onClick={()=> setMostrarForo(true)}
            className="bg-azulUTN text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Publicar
          </button>
        </div>

        {carga && <p className="text-gray-400">Cargando foros...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {foroBuscador.length > 0 ? (
          foroBuscador.map((foro) => (
            <ForoTarjeta key={foro.id} foro={foro} />
          ))
        ) : (
          <p className="text-gray-400">No se encontraron foros.</p>
        )}
      </main>

      {/*Mostar Modal para Foro*/}
      <Modal visible={mostrarForo} onClose={() => setMostrarForo(false)}>
        <CrearForo onClose={() => setMostrarForo(false)} />
      </Modal>
    </div>
  );
}