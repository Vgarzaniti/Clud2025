import { useNavigate } from "react-router-dom";
import "../input.css";

export default function ForoTarjeta({ foro }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/foro/${foro.idForo}`)}
      className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md cursor-pointer hover:bg-gray-800 transition"
    >
      <h2 className="text-lg font-semibold text-white">{foro.pregunta}</h2>

      <p className="text-gray-400 text-sm mt-2">
        Materia: {foro.materia_nombre || "Sin materia"}
      </p>

      <p className="text-gray-400 text-sm">
        Carrera: {foro.carrera_nombre || "Sin carrera"}
      </p>

      <p className="text-gray-500 text-xs mt-2">
        Creado:{" "}
        {foro.fecha_creacion
          ? new Date(foro.fecha_creacion).toLocaleString("es-AR")
          : "Fecha no disponible"}
      </p>

      <div className="flex justify-between text-gray-400 text-sm mt-3">
        <span>Autor: {foro.usuario_nombre || "Anónimo"}</span>
        <span>💬 {foro.respuestas_count ?? 0} respuestas</span>
      </div>
    </div>
  );
}


