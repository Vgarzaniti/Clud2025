import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { respuestaService } from "../services/respuestaService";
import "../input.css";


export default function ForoTarjeta({ foro, mostrarAcciones, onEditar, onEliminar }) {
  const navigate = useNavigate();
  const [totalRespuestas, setTotalRespuestas] = useState(0);
  const [loadingResp, setLoadingResp] = useState(true);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    const cargarTotalRespuestas = async () => {
      try {
        setLoadingResp(true);

        const respuestas = await respuestaService.obtenerRespuestasPorForo(foro.idForo);
        setTotalRespuestas(respuestas?.length ?? 0);

      } catch (err) {
        console.error("Error al cargar respuestas:", err);
      } finally {
        setLoadingResp(false);
      }
    };

    if (foro?.idForo) {
      cargarTotalRespuestas();
    }
    
  }, [foro.idForo]);

return (
    <div
      onClick={() => navigate(`/foro/${foro.idForo}`)}
      className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md cursor-pointer hover:bg-gray-800 transition"
    >
      <div className="flex gap-3 items-start">
        <div className="flex-1 min-w-0">
          <h2
            className={`text-lg font-semibold text-white whitespace-pre-wrap break-word overflow-hidden ${
              expandido ? "" : "line-clamp-2"
            }`}
          >
            {foro.pregunta}
          </h2>

          {foro.pregunta.length > 190 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandido(!expandido);
              }}
              className="text-sm text-azulUTN mt-1 hover:underline"
            >
              {expandido ? "Mostrar menos" : "Mostrar más"}
            </button>
          )}
        </div>

        {mostrarAcciones && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditar?.(foro);
              }}
              className="text-sm bg-azulUTN text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              Editar
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEliminar?.(foro);
              }}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Materia: {foro.materiaNombre || "Sin materia"}
      </p>

      <p className="text-gray-400 text-sm">
        Carrera: {foro.carreraNombre || "Sin carrera"}
      </p>

      <p className="text-gray-500 text-xs mt-4">
        Creado:{" "}
        {foro.fecha_creacion
          ? new Date(foro.fecha_creacion).toLocaleString("es-AR")
          : "Fecha no disponible"}
      </p>

      <div className="flex justify-end text-gray-400 text-sm mt-2">
        💬 {loadingResp ? "Cargando..." : `${totalRespuestas} respuestas`}
      </div>
    </div>
  );
}



