import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { respuestaService } from "../services/respuestaService";
import "../input.css";


export default function ForoTarjeta({ foro, mostrarAcciones, onEditar, onEliminar }) {
  const navigate = useNavigate();
  const [totalRespuestas, setTotalRespuestas] = useState(0);
  const [loadingResp, setLoadingResp] = useState(true);

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
      className="relative bg-panel p-5 rounded-2xl border border-gray-700 shadow-md cursor-pointer hover:bg-gray-800 transition"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-white mr-4">
          {foro.pregunta}
        </h2>

        {mostrarAcciones && (
          <div className="flex gap-2">
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
        Materia: {foro.materiaNombre || foro.materia_nombre || "Sin materia"}
      </p>

      <p className="text-gray-400 text-sm">
        Carrera: {foro.carreraNombre || foro.carrera_nombre || "Sin carrera"}
      </p>

      <p className="text-gray-500 text-xs mt-4">
        Creado:{" "}
        {foro.fecha_creacion
          ? new Date(foro.fecha_creacion).toLocaleString("es-AR")
          : "Fecha no disponible"}
      </p>

      <div className="flex justify-end text-gray-400 text-sm">
        <span className="flex items-center gap-2">
          💬
          {loadingResp ? (
            <span className="animate-pulse">Cargando...</span>
          ) : (
            <span>{totalRespuestas} respuestas</span>
          )}
        </span>
      </div>
    </div>
  );
}



