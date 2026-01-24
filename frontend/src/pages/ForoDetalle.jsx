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
/*import userService from "../services/userService.js";*/
import { useAuth } from "../context/useAuth.js";

export default function ForoDetalle() {
  const { usuario } = useAuth();
  const { foroId } = useParams();
  const [foro, setForo] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [modoVista, setModoVista] = useState("normal");
  const [loading, setLoading] = useState(true);
  const cargarRespuestas = useCallback(async () => {
      const respuestasData = await respuestaService.obtenerPorForo(foroId);
      const ordenadas = [...respuestasData].sort(
        (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      );
      setRespuestas(ordenadas);
    }, [foroId])
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const foroData = await foroService.obtenerPorId(foroId);
        console.log(foroData);
        
        if (!foroData) {
          setForo(null);
          setRespuestas([]);
          return;
        }
        const [respuestasData, materias] = await Promise.all([
          respuestaService.obtenerPorTodos(),
          materiaService.obtenerTodos(),
        ]);
        const respuestasForo = Array.isArray(respuestasData)
          ? respuestasData.filter((r) => r.foro === foroData.idForo)
          : [];
        const materia = materias.find(
          (m) => m.idMateria === foroData.materia
        );
        const usuario = "luz";/*await userService.obtenerPorId(foroData.usuario);*/
        const foroEnriquecido = {
          ...foroData,
          materia_nombre: materia ? materia.nombre : "Sin materia",
          carrera_nombre: materia ? materia.carrera_nombre : "Sin carrera",
          usuario_nombre: usuario/*?.nombreYapellido || "Anónimo"*/,
        };
        setForo(foroEnriquecido);
        
        const ordenadas = [...respuestasForo].sort(
          (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
        );
        setRespuestas(ordenadas); 
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, [foroId, cargarRespuestas]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-cyan-950 p-5 rounded-2xl border border-gray-700 shadow-md animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/4 mt-6" />
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-800 rounded-full animate-pulse" />
            <div className="h-10 w-28 bg-gray-800 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 animate-pulse space-y-3">
                <div className="h-4 bg-gray-700 rounded w-1/4" />
                <div className="h-3 bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-700 rounded w-5/6" />
                <div className="h-3 bg-gray-700 rounded w-2/3" />
              </div>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-4">
          <aside className="bg-panel p-4 rounded-2xl border border-gray-700 animate-pulse space-y-4">
            <div className="h-6 bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-10 bg-gray-700 rounded-xl mt-6" />
          </aside>
        </div>

      </div>
    );
  }


  if (!foro) {
    return (
      <p className="text-center text-red-400 mt-10">
        Foro no encontrado
      </p>
    );
  }
  const respuestasOrdenadas = [...respuestas].sort((a, b) => {
    return modoVista === "ranking"
    ? b.puntaje_neto - a.puntaje_neto
    : new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
  });
  const manejarVoto = (idRespuesta, delta, nuevoVoto) => {
    setRespuestas(prev =>
      prev.map(r =>
        r.idRespuesta === idRespuesta
          ? {
              ...r,
              puntaje_neto: r.puntaje_neto + delta,
              voto_usuario: nuevoVoto
            }
          : r
      )
    );
  };
  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna principal */}
      <div className="lg:col-span-2 space-y-4">
        {/* Pregunta */}
        <div className="bg-cyan-950 p-5 rounded-2xl border border-gray-700 shadow-md">
          <h1 className="text-2xl font-bold mb-2">{foro.pregunta}</h1>
          <p className="text-gray-400 text-sm mb-2">
            Materia: {foro.materia_nombre}
          </p>
          {/* Archivos adjuntos */}
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
          <p className="text-gray-500 text-xs mt-3">
            Creado el{" "}
            {foro.fecha_creacion
              ? new Date(foro.fecha_creacion).toLocaleString("es-AR")
              : "Fecha desconocida"}
          </p>
        </div>
        {/* Filtros */}
        <div className="flex gap-3">
          <button
            onClick={() => setModoVista("normal")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              modoVista === "normal"
                ? "bg-indigo-800 text-white"
                : "bg-indigo-950 border border-gray-600 hover:bg-gray-800"
            }`}
          >
            Filtros
          </button>
          <button
            onClick={() => setModoVista("ranking")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              modoVista === "ranking"
                ? "bg-indigo-800 text-white"
                : "bg-indigo-950 border border-gray-600 hover:bg-gray-800"
            }`}
          >
            Ranking
          </button>
        </div>
        {/* Respuestas */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="space-y-4"
          >
            {respuestasOrdenadas.length > 0 ? (
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
      {/* Columna lateral */}
      <div className="flex flex-col gap-4">
        <aside className="bg-panel p-4 rounded-2xl border border-gray-700 h-fit space-y-4">
          <div className="border border-gray-600 rounded-lg p-3">
            <h3 className="text-2xl font-semibold mb-2 text-azulUTN">
              Información del Foro
            </h3>
            <p className="text-lg">
              <span className="font-semibold">Materia:</span>{" "}
              {foro.materia_nombre}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Carrera:</span>{" "}
              {foro.carrera_nombre}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Autor:</span>{" "}
              {foro.usuario_nombre}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Fecha:</span>{" "}
              {foro.fecha_creacion
                ? new Date(foro.fecha_creacion).toLocaleDateString("es-AR")
                : "Desconocida"}
            </p>
          </div>
        </aside>
        <button
          onClick={() => setMostrarRespuesta(true)}
          className="w-full bg-azulUTN text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition text-lg shadow-lg"
        >
          Responder
        </button>
      </div>
      {/* Modal */}
      <Modal
        visible={mostrarRespuesta}
        onClose={() => setMostrarRespuesta(false)}
      >
        <CrearRespuesta
          foroId={foro.idForo}
          materiaId={foro.materia}
          usuarioId={usuario?.idUsuario}
          onClose={() => setMostrarRespuesta(false)}
          onSave={async() => {
            await cargarRespuestas();
            setMostrarRespuesta(false);
          }}
        />
      </Modal>
    </div>
  );
}