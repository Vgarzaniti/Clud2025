import { useNavigate } from "react-router-dom";
import "../input.css";

// Cambiar elementos de Respuesta para estar en relacion con el back
export default function ForoTarjeta({ foro }) {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/foro/${foro.id}`)}
      className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md cursor-pointer hover:bg-gray-800 transition"
    >
      <h2 className="text-lg font-semibold text-white">{foro.pregunta}</h2>
      <p className="text-gray-400 text-sm mb-2 mt-2">Materia: {foro.materia}</p>
      <div className="flex justify-between text-gray-400 text-sm">
        <span>Autor: {foro.autor}</span>
        <span>Respuestas: {foro.respuestas}</span>
      </div>
    </div>
  );
}

