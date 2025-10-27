import { useNavigate } from "react-router-dom";
import "../input.css";

// Cambiar elementos de Respuesta para estar en relacion con el back
export default function ForoTarjeta({ foro }) {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/foro/${foro.id}`)}
      className="bg-panel p-4 rounded-2xl border border-gray-700 shadow-md cursor-pointer hover:bg-gray-800 transition"
    >
      <h2 className="text-lg font-semibold text-white">{foro.titulo}</h2>
      <p className="text-gray-300 text-sm mb-2">{foro.descripcion}</p>
      <div className="flex justify-between text-gray-400 text-sm">
        <span>Autor: {foro.autor}</span>
        <span>Respuestas: {foro.respuestas}</span>
      </div>
    </div>
  );
}

