import { useState, useEffect, useMemo } from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import RespuestaTarjeta from "../components/RespuestaTarjeta.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal.jsx";
import EditarRespuesta from "../components/EditarRespuesta.jsx";
import EditarForo from "../components/EditarForo.jsx";
import EditarUsuario from "../components/EditarUsuario.jsx";
import { useNavigate } from "react-router-dom";
import { foroService } from "../services/foroService.js";
import { respuestaService } from "../services/respuestaService.js";
import { materiaService } from "../services/materiaService.js";
import { carreraService } from "../services/carreraService.js";

export default function Perfil() {
  const [vista, setVista] = useState("foros");
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [foroSeleccionado, setForoSeleccionado] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mostrarEditarUsuario, setMostrarEditarUsuario] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [mostrarConfirmarCerrarSesion, setMostrarConfirmarCerrarSesion] = useState(false);
  const [elementoAEliminar, setElementoAEliminar] = useState(null);
  const [foros, setForos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [carga, setCarga] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const usuario = {
    id: 1,
    nombre: "Juan Pérez",
    username: "jperez",
    email: "juanperez@utn.edu.ar",
  };

  const handleVotoRespuesta = (idRespuesta, delta, nuevoVoto) => {
    setRespuestas(prev =>
      prev.map(r =>
        r.idRespuesta === idRespuesta
          ? {
              ...r,
              puntaje_neto: (r.puntaje_neto ?? 0) + delta,
              voto_usuario: nuevoVoto
            }
          : r
      )
    );
  };


    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCarga(true);

                const [forosUsuario, respuestasUsuario, materiasBD, carrerasBD] = await Promise.all([
                    foroService.buscarUsuario(usuario.id),
                    respuestaService.buscarUsuario(usuario.id),
                    materiaService.obtenerTodos(),
                    carreraService.obtenerTodos(),
                ]);

                setCarreras(carrerasBD);
                setMaterias(materiasBD);

                const ordenarPorFecha = (arr) =>
                  arr
                    .filter((e) => e.fecha_creacion)
                    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

                setForos(ordenarPorFecha(forosUsuario));
                setRespuestas(ordenarPorFecha(respuestasUsuario));
                
                } catch (err) {
                  console.error("❌ Error al cargar datos del perfil:", err);
                  setError("No se pudieron cargar tus foros y respuestas.");
                } finally {
                  setCarga(false);
                }
            };

        cargarDatos();
    },  [usuario.id]);

    const forosEnriquecidos = useMemo(() => {
        if (!foros.length || !materias.length) return [];
    
        return foros.map((foro) => {
          const materiaInfo = materias.find((m) => m.idMateria === foro.materia);
          const carreraInfo = carreras.find((c) => c.idCarrera === materiaInfo?.carrera);

          return {
            ...foro,
            materiaNombre: materiaInfo?.nombre || "Sin materia",
            carreraNombre: carreraInfo?.nombre || "Sin carrera",
          };
        });
    }, [foros, materias, carreras]);

    const respuestasEnriquecidas = useMemo(() => {
      if (!respuestas.length || !materias.length) return [];

      return respuestas.map((res) => {
        const materiaInfo = materias.find((m) => m.idMateria === res.materia);
        const carreraInfo = carreras.find((c) => c.idCarrera === materiaInfo?.carrera);

        return {
          ...res,
          materiaNombre: materiaInfo?.nombre || "Sin materia",
          carreraNombre: carreraInfo?.nombre || "Sin carrera",
        };
      });
    }, [respuestas, materias, carreras]);


    if (carga) {
        return (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-400 animate-pulse">Cargando tus datos...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
        </div>
        );
    }

    const handleGuardarForo = (nuevoForo) => {
        setForos((prev) =>
        prev.map((f) => (f.idForo === nuevoForo.idForo ? nuevoForo : f))
        );
        setMostrarEditar(false);
    };

    const handleGuardarRespuesta = (nuevaRespuesta) => {
        setRespuestas((prev) =>
        prev.map((r) =>
            r.idRespuesta === nuevaRespuesta.idRespuesta ? nuevaRespuesta : r
        )
        );
        setMostrarEditar(false);
    };

    const handleGuardarUsuario = (nuevoUsuario) => {
        console.log("Usuario editado:", nuevoUsuario);
        setMostrarEditarUsuario(false);
    };

    const handleEliminarClick = (elemento, tipo) => {
        setElementoAEliminar({ ...elemento, tipo });
        setMostrarConfirmar(true);
    };

  const handleConfirmarEliminacion = async () => {
    try {
        if (elementoAEliminar.tipo === "foro") {
            await foroService.eliminar(elementoAEliminar.idForo);
            setForos((prev) =>
              prev.filter((f) => f.idForo !== elementoAEliminar.idForo)
            );
        } else if (elementoAEliminar.tipo === "respuesta") {
            await respuestaService.eliminar(elementoAEliminar.idRespuesta);
            setRespuestas((prev) =>
              prev.filter((r) => r.idRespuesta !== elementoAEliminar.idRespuesta)
            );
        }
    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        alert("No se pudo eliminar el elemento. Intenta nuevamente.");
    } finally {
        setMostrarConfirmar(false);
        setElementoAEliminar(null);
    }
  };

  const handleConfirmarCerrarSesion = () => {
    setMostrarConfirmarCerrarSesion(false);
    navigate("/");
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel lateral usuario */}
      <aside className="bg-perfilPanel p-8 pt-20 mt-10 rounded-2xl border border-gray-700 relative w-72 mx-auto self-start">
        <div className="shadow-gray-900 shadow-lg w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-fondo absolute -top-12 left-1/2 transform -translate-x-1/2">
          {usuario.nombre
            ? usuario.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "US"}
        </div>

        <div className="mt-15 space-y-2 text-left">
          <div>
            <p className="font-semibold text-white">Nombre Completo</p>
            <p className="ml-2 text-gray-400">{usuario.nombre}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Nombre Usuario</p>
            <p className="ml-2 text-gray-400">{usuario.username}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Mail</p>
            <p className="ml-2 text-gray-400">{usuario.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 w-full">
          <button
            onClick={() => setMostrarEditarUsuario(true)}
            className="bg-sky-950 border border-gray-600 py-2 rounded-lg hover:bg-gray-800"
          >
            Editar
          </button>
          <button
            onClick={() => setMostrarConfirmarCerrarSesion(true)}
            className="bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-semibold mb-2 text-azulUTN">
          Mi Actividad
        </h1>

        {/* Selector de vista */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setVista("foros")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              vista === "foros"
                ? "bg-indigo-800 text-white"
                : "bg-indigo-950 border border-gray-600 hover:bg-gray-800"
            }`}
          >
            Foros creados
          </button>
          <button
            onClick={() => setVista("respuestas")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              vista === "respuestas"
                ? "bg-indigo-800 text-white"
                : "bg-indigo-950 border border-gray-600 hover:bg-gray-800"
            }`}
          >
            Respuestas realizadas
          </button>
        </div>

        {/* Listado dinámico */}
        <AnimatePresence mode="wait">
          {vista === "foros" ? (
            <motion.div
              key="foros"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {forosEnriquecidos.map((foro) => (
                <ForoTarjeta
                  key={foro.idForo}
                  foro={foro}
                  mostrarAcciones={true} 
                  onEditar={(foro) => {
                    setForoSeleccionado(foro);
                    setMostrarEditar("foro");
                  }}
                  onEliminar={(foro) => handleEliminarClick(foro, "foro")}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="respuestas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {respuestasEnriquecidas.map((res) => (
                <div key={res.idRespuesta} className="relative">
                  <RespuestaTarjeta respuesta={res} onVoto={handleVotoRespuesta} />
                  <div className="absolute top-5 right-5 flex gap-2">
                    <button
                      onClick={() => {
                        setRespuestaSeleccionada(res);
                        setMostrarEditar("respuesta");
                      }}
                      className="text-sm bg-azulUTN text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarClick(res, "respuesta")}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modales de edición */}
      <Modal visible={!!mostrarEditar} onClose={() => setMostrarEditar(false)}>
        {mostrarEditar === "foro" && foroSeleccionado && (
          <EditarForo
            foroActual={foroSeleccionado}
            onSave={handleGuardarForo}
            onClose={() => setMostrarEditar(false)}
          />
        )}
        {mostrarEditar === "respuesta" && respuestaSeleccionada && (
          <EditarRespuesta
            respuestaActual={respuestaSeleccionada}
            onSave={handleGuardarRespuesta}
            onClose={() => setMostrarEditar(false)}
          />
        )}
      </Modal>

      {/* Modal editar usuario */}
      <Modal
        visible={mostrarEditarUsuario}
        onClose={() => setMostrarEditarUsuario(false)}
      >
        <EditarUsuario
          usuarioActual={usuario}
          onSave={handleGuardarUsuario}
          onClose={() => setMostrarEditarUsuario(false)}
        />
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal visible={mostrarConfirmar} onClose={() => setMostrarConfirmar(false)}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white">
            ¿Estás seguro de que deseas eliminar este{" "}
            {elementoAEliminar?.tipo === "foro" ? "foro" : "comentario"}?
          </h2>
          <div className="flex justify-center gap-1">
            <button
              onClick={handleConfirmarEliminacion}
              className="bg-red-600 px-5 py-2 rounded-lg text-white hover:bg-red-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => setMostrarConfirmar(false)}
              className="bg-gray-700 px-5 py-2 rounded-lg text-white hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar cierre de sesión */}
      <Modal 
        visible={mostrarConfirmarCerrarSesion}
        onClose={() => setMostrarConfirmarCerrarSesion(false)}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white">
            ¿Estás seguro de que deseas cerrar sesión?
          </h2>
          <div className="flex justify-center gap-1">
            <button
              onClick={handleConfirmarCerrarSesion}
              className="bg-red-600 px-5 py-2 rounded-lg text-white hover:bg-red-700"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => setMostrarConfirmarCerrarSesion(false)}
              className="bg-gray-700 px-5 py-2 rounded-lg text-white hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}