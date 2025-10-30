import { useState } from "react";
import BarraLado from "../components/BarraLado.jsx";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";
import "../input.css";

export default function Home() {
  const [mostrarForo, setMostrarForo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  
  const foros = [
    {
      id: 1,
      titulo: "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizo",
      autor: "Juan Pérez",
      materia: "Matemáticas 2",
      respuestas: 5,
    },
    {
      id: 2,
      titulo: "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizo",
      autor: "Ana Gómez",
      materia: "Física 1",
      respuestas: 3,
    },
    {
      id: 3,
      titulo: "Cómo optimizar código en React",
      autor: "Carlos Ruiz",
      materia: "Programación Web",
      respuestas: 8,
    },
  ];

  const foroBuscador = foros.filter((foro) => 
    foro.titulo.toLowerCase().includes(busqueda.toLowerCase())
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

        {foroBuscador.length > 0 ? (
          foroBuscador.map((foro) => (
            <ForoTarjeta key={foro.id} foro={foro} />
          ))
        ) : (
          <p className="text-gray-400">No se encontraron foros con ese título.</p>
        )}
      </main>

      {/*Mostar Modal para Foro*/}
      <Modal visible={mostrarForo} onClose={() => setMostrarForo(false)}>
        <CrearForo onClose={() => setMostrarForo(false)} />
      </Modal>
    </div>
  );
}