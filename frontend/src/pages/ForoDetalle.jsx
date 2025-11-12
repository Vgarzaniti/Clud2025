import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import RespuestaTarjeta from "../components/RespuestaTarjeta.jsx";
import CrearRespuesta from "../components/CrearRespuesta.jsx";
import Modal from "../components/Modal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { foroService } from "../services/foroService.js";
import { respuestaService } from "../services/respuestaService.js";
import { materiaService } from "../services/materiaService.js";


export default function ForoDetalle() {
  const { foroId } = useParams();
  const [foro, setForo] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [modoVista, setModoVista] = useState("normal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [foroData, respuestasData, materias] = await Promise.all([
          foroService.obtenerPorId(foroId),
          respuestaService.obtenerPorForo(foroId),
          materiaService.obtenerTodos(),
        ]);

        const materia = materias.find((m) => m.idMateria === foroData.materia);
        const foroEnriquecido = {
          ...foroData,
          materia_nombre: materia ? materia.nombre : "Sin materia",
          carrera_nombre: materia ? materia.carrera_nombre : "Sin carrera",
          usuario_nombre: foroData.usuario || "Anónimo",
        };

        // Ordenar respuestas por ID (o puntaje si querés)
        const respuestasOrdenadas = respuestasData.sort(
          (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
        );

        setForo(foroEnriquecido);
        setRespuestas(respuestasOrdenadas);
      } catch (error) {
        console.error("Error al cargar datos del foro:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [foroId]);

  if (loading) return <p className="text-center text-gray-400 mt-10">Cargando foro...</p>;
  if (!foro) return <p className="text-center text-red-400 mt-10">Foro no encontrado</p>;

  const respuestasOrdenadas = [...respuestas].sort((a, b) => {
    if (modoVista === "ranking") return b.puntaje - a.puntaje;
    return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
  });

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna principal */}
      <div className="lg:col-span-2 space-y-4">
        {/* Pregunta principal */}
        <div className="bg-cyan-950 p-5 rounded-2xl border border-gray-700 shadow-md">
          <h1 className="text-2xl font-bold mb-2">{foro.pregunta}</h1>
          <p className="text-gray-400 text-sm mb-2">
            Materia: {foro.materia_nombre}
          </p>
          <p className="text-gray-300 mb-3">{foro.descripcion || ""}</p>
          <p className="text-gray-500 text-xs">
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

        {/* Lista de respuestas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={modoVista}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="space-y-4"
          >
            {respuestasOrdenadas.length > 0 ? (
              respuestasOrdenadas.map((res) => (
                <RespuestaTarjeta key={res.id} respuesta={res} />
              ))
            ) : (
              <p className="text-gray-400 italic">No hay respuestas todavía.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Columna lateral */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setMostrarRespuesta(true)}
          className="w-full bg-azulUTN text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition text-lg shadow-lg"
        >
          Responder
        </button>

        <aside className="bg-panel p-4 rounded-2xl border border-gray-700 h-fit space-y-4">
          <div className="border border-gray-600 rounded-lg p-3">
            <h3 className="text-2xl font-semibold mb-2 text-azulUTN">
              Información del Foro
            </h3>
            <p className="text-xl">
              <span className="font-semibold">Materia:</span> {foro.materia_nombre}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Carrera:</span> {foro.carrera_nombre}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Autor:</span> {foro.usuario_nombre}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Fecha:</span>{" "}
              {foro.fecha_creacion
                ? new Date(foro.fecha_creacion).toLocaleDateString("es-AR")
                : "Desconocida"}
            </p>
          </div>
        </aside>
      </div>

      {/* Modal para responder */}
      <Modal visible={mostrarRespuesta} onClose={() => setMostrarRespuesta(false)}>
        <CrearRespuesta
          foroId={foroId}
          onClose={() => setMostrarRespuesta(false)}
        />
      </Modal>
    </div>
  );
}