import { useState } from "react";
import BarraLado from "../components/BarraLado.jsx";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";
import "../input.css";

export default function Inicio() {
  const [mostrarForo, setMostrarForo] = useState(false);
  
  const foros = [
    {
      id: 1,
      titulo: "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizo",
      descripcion: "Ejemplo de respuesta con archivo y usuario asociado",
      autor: "Juan Pérez",
      respuestas: 5,
    },
    {
      id: 2,
      titulo: "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizo",
      descripcion: "Ejemplo de otra publicación con datos y archivo adjunto",
      autor: "Ana Gómez",
      respuestas: 3,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6 flex gap-6">
      <BarraLado />
      <main className="flex-1 space-y-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar Foro"
            className="bg-panel border border-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg flex-1"
          />
          <button 
            onClick={()=> setMostrarForo(true)}
            className="bg-azulUTN text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Publicar
          </button>
        </div>

        {foros.map((foro) => (
          <ForoTarjeta key={foro.id} foro={foro} />
        ))}
      </main>

      {/*Mostar Modal para Foro*/}
      <Modal visible={mostrarForo} onClose={() => setMostrarForo(false)}>
        <CrearForo onClose={() => setMostrarForo(false)} />
      </Modal>
    </div>
  );
}