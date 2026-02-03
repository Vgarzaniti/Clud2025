import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import RespuestaTarjeta from "../components/RespuestaTarjeta.jsx";
import CrearRespuesta from "../components/CrearRespuesta.jsx";
import Modal from "../components/Modal.jsx";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { foroService } from "../services/foroService.js";
import { respuestaService } from "../services/respuestaService.js";
import { materiaService } from "../services/materiaService.js";
import { useAuth } from "../context/useAuth.js";

export default function ForoDetalle() {
  const { usuario } = useAuth();
  const { foroId } = useParams();

  const [foro, setForo] = useState(null);
  const [respuestas, setRespuestas] = useState([]);

  const [loadingForo, setLoadingForo] = useState(true);
  const [loadingRespuestas, setLoadingRespuestas] = useState(true);

  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [modoVista, setModoVista] = useState("normal");

  const cargarRespuestas = useCallback(async () => {
    const data = await respuestaService.obtenerRespuestasPorForo(foroId);
    const ordenadas = [...data].sort(
      (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
    );
    setRespuestas(ordenadas);
  }, [foroId]);

  useEffect(() => {
    const cargarForo = async () => {
      try {
        setLoadingForo(true);

        const foroData = await foroService.obtenerPorId(foroId);
        if (!foroData) {
          setForo(null);
          return;
        }

        const materias = await materiaService.obtenerTodos();
        const materia = materias.find(
          (m) => m.idMateria === foroData.materia
        );

        setForo({
          ...foroData,
          materia_nombre: materia?.nombre || "Sin materia",
          carrera_nombre: materia?.carrera_nombre || "Sin carrera",
          usuario_nombre: foroData.usuario_username || "Anónimo",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingForo(false);
      }
    };

    cargarForo();
  }, [foroId]);

  useEffect(() => {
    if (!foro) return;

    const cargar = async () => {
      try {
        setLoadingRespuestas(true);
        await cargarRespuestas();
      } finally {
        setLoadingRespuestas(false);
      }
    };

    cargar();
  }, [foro, cargarRespuestas]);

  const respuestasOrdenadas = [...respuestas].sort((a, b) => {
    return modoVista === "ranking"
      ? b.puntaje_neto - a.puntaje_neto
      : new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
  });

  const manejarVoto = (idRespuesta, delta, nuevoVoto) => {
    setRespuestas((prev) =>
      prev.map((r) =>
        r.idRespuesta === idRespuesta
          ? {
              ...r,
              puntaje_neto: r.puntaje_neto + delta,
              voto_usuario: nuevoVoto,
            }
          : r
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2 space-y-4">

        {loadingForo ? (
          <div className="bg-cyan-950 p-5 rounded-2xl animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-700 rounded w-1/3" />
          </div>
        ) : !foro ? (
          <p className="text-red-400">Foro no encontrado</p>
        ) : (
          <div className="bg-cyan-950 p-5 rounded-2xl border border-gray-700">
            <h1 className="text-2xl font-bold mb-2">{foro.pregunta}</h1>
            <p className="text-gray-400 text-sm">
              Materia: {foro.materia_nombre}
            </p>

            {foro.archivos && foro.archivos.length > 0 && (
              <div className="mt-4 border-t border-gray-700 pt-3">
                <p className="text-sm text-gray-400 mb-2">
                  Archivos adjuntos:
                </p>
                <ul className="space-y-2">
                  {foro.archivos.map((fa) => {
                    const nombreArchivo = fa.archivo_url
                      ? fa.archivo_url.split("/").pop()
                      : "Archivo";
                    return (
                      <li
                        key={fa.id}
                        className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg"
                      >
                        <span>📎</span>
                        <a
                          href={fa.archivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-azulUTN hover:underline break-all"
                        >
                          {nombreArchivo}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <p className="text-gray-500 text-xs mt-2">
              {new Date(foro.fecha_creacion).toLocaleString("es-AR")}
            </p>
          </div>
        )}

        {!loadingForo && foro && (
          <div className="flex gap-3">
            <button
              onClick={() => setModoVista("normal")}
              className={`px-4 py-2 rounded-full ${
                modoVista === "normal"
                  ? "bg-indigo-800 border hover:bg-indigo-900"
                  : "bg-indigo-950  hover:bg-indigo-900"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setModoVista("ranking")}
              className={`px-4 py-2 rounded-full ${
                modoVista === "ranking"
                  ? "bg-indigo-800 border hover:bg-indigo-900"
                  : "bg-indigo-950  hover:bg-indigo-900"
              }`}
            >
              Ranking
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {loadingRespuestas ? (
              <div className="bg-gray-800 p-4 rounded-2xl animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-full" />
              </div>
            ) : respuestasOrdenadas.length > 0 ? (
              respuestasOrdenadas.map((res) => (
                <RespuestaTarjeta
                  key={res.idRespuesta}
                  respuesta={res}
                  onVoto={manejarVoto}
                  userId={usuario?.idUsuario}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">
                No hay respuestas todavía. ¡Se el primero en responder!
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!loadingForo && foro && (
        <div className="flex flex-col gap-4">
          <aside className="bg-blue-950 p-4 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-semibold text-azulUTN mb-2">
              Información del Foro
            </h3>
            <p className="text-l">
              <span className="font-semibold">Materia:</span>{" "}
              {foro.materia_nombre}
            </p>
            <p className="text-l">
              <span className="font-semibold">Carrera:</span>{" "}
              {foro.carrera_nombre}
            </p>
            <p className="text-l">
              <span className="font-semibold">Autor:</span>{" "}
              {foro.usuario_nombre}
            </p>
          </aside>

          <button
            onClick={() => setMostrarRespuesta(true)}
            className="bg-azulUTN py-3 rounded-xl font-semibold hover:bg-blue-600"
          >
            Responder
          </button>
        </div>
      )}

      {/* ================= Modal ================= */}
      <Modal
        visible={mostrarRespuesta}
        onClose={() => setMostrarRespuesta(false)}
      >
        <CrearRespuesta
          foroId={foro?.idForo}
          materiaId={foro?.materia}
          usuarioId={usuario?.idUsuario}
          onClose={() => setMostrarRespuesta(false)}
          onSave={async () => {
            await cargarRespuestas();
            setMostrarRespuesta(false);
          }}
        />
      </Modal>
    </div>
  );
}
