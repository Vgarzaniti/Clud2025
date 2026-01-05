import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { foroService } from "../services/foroService";
import "../input.css";

export default function ForoTarjeta({ foro, mostrarAcciones, onEditar, onEliminar }) {
  const navigate = useNavigate();
  const [totalRespuestas, setTotalRespuestas] = useState(0);
  const [loadingResp, setLoadingResp] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        setLoadingResp(true);
        const data = await foroService.obtenerPorId(foro.idForo, true);

        if (activo) {
          setTotalRespuestas(data.totalRespuestas);
        }
      } catch (error) {
        if (activo) {
          setTotalRespuestas(0);
          console.error("Error al cargar el total de respuestas:", error);
        }
      } finally {
        if (activo) {
          setLoadingResp(false);
        }
      }
    };

    cargar();

    return () => {
      activo = false;
    };
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

      <p className="text-gray-400 text-sm mt-2">
        Materia: {foro.materiaNombre || foro.materia_nombre || "Sin materia"}
      </p>

      <p className="text-gray-400 text-sm">
        Carrera: {foro.carreraNombre || foro.carrera_nombre || "Sin carrera"}
      </p>

      <p className="text-gray-500 text-xs mt-2">
        Creado:{" "}
        {foro.fecha_creacion
          ? new Date(foro.fecha_creacion).toLocaleString("es-AR")
          : "Fecha no disponible"}
      </p>

      <div className="flex justify-between text-gray-400 text-sm mt-3">
        <span>Autor: {foro.usuario || "Anónimo"}</span>
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



