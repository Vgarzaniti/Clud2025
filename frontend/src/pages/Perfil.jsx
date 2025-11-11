import { useState } from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import RespuestaTarjeta from "../components/RespuestaTarjeta.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal.jsx";
import EditarRespuesta from "../components/EditarRespuesta.jsx";
import EditarForo from "../components/EditarForo.jsx";
import { useNavigate } from "react-router-dom";
import EditarUsuario from "../components/EditarUsuario.jsx";

export default function Perfil() {
    const [vista, setVista] = useState("foros");
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [foroSeleccionado, setForoSeleccionado] = useState(null);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
    const [mostrarEditarUsuario, setMostrarEditarUsuario] = useState(false);
    const navigate = useNavigate();

    const usuario = {
        nombre: "Juan Pérez",
        username: "jperez",
        email: "juanperez@utn.edu.ar",
    };


    const foros = [
        {
            id: 1,
            pregunta: "Optimización de algoritmos de búsqueda",
            autor: "Juan Pérez",
            carrera: "Sistemas",
            materia: "Base De Datos",
            archivo: "ejemplo.pdf",
            respuestas: 10,
        },
        {
            id: 2,
            pregunta: "Errores al compilar en Visual Studio",
            autor: "Juan Pérez",
            carrera: "Sistemas",
            materia: "Programacion 2",
            respuestas: 3,
        },
    ];

    const respuestas = [
        {
            id: 1,
            autor: "Juan Pérez",
            respuesta:
                "Podrías revisar la versión del compilador, muchas veces genera errores con librerías antiguas.",
            puntaje: 8,
            archivos: "compilador-fix.txt",
        },
        {
            id: 2,
            autor: "Juan Pérez",
            respuesta:
                "En mi experiencia, usar índices mejora mucho el rendimiento de consultas SQL grandes.",
            puntaje: 5,
        },
    ];

    const handleGuardarForo = (nuevoForo) => {
        console.log("Foro editado:", nuevoForo);
        setMostrarEditar(false);
    };

    const handleGuardarRespuesta = (nuevaRespuesta) => {
        console.log("Respuesta editada:", nuevaRespuesta);
        setMostrarEditar(false);
    };

    const handleGuardarUsuario = (nuevoUsuario) => {
    console.log("Usuario editado:", nuevoUsuario);
    setMostrarEditarUsuario(false);
    };

    return (
        <div className="max-w-7xl mx-auto mt-10 px-6 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
            {/* Columna lateral: perfil */}
            <aside className="bg-perfilPanel p-8 pt-20 mt-10 rounded-2xl border border-gray-700 relative w-72 mx-auto">
                <div className="shadow-gray-900 shadow-lg w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-fondo absolute -top-12 left-1/2 transform -translate-x-1/2">
                    {usuario.nombre
                        ? usuario.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "US"
                    }
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
                        className="bg-sky-950 border border-gray-600 py-2 rounded-lg hover:bg-gray-800">
                        Editar
                    </button>
                    <button onClick={() => navigate("/")} className="bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition">
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

                {/* Contenido dinámico */}
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
                            {foros.map((foro) => (
                                <div key={foro.idForo} className="relative">
                                    <ForoTarjeta foro={foro} />
                                    <button
                                        onClick={() => {
                                            setForoSeleccionado(foro);
                                            setMostrarEditar("foro");
                                        }}
                                        className="absolute top-5 right-5 text-sm bg-azulUTN text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                                    >
                                        Editar
                                    </button>
                                </div>
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
                            {respuestas.map((res) => (
                                <div key={res.id} className="relative">
                                    <RespuestaTarjeta respuesta={res} />
                                    <button
                                        onClick={() => {
                                        setRespuestaSeleccionada(res);
                                        setMostrarEditar("respuesta");
                                        }}
                                        className="absolute top-5 right-5 text-sm bg-azulUTN text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                                    >
                                        Editar
                                    </button>
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

            {/* Modal para editar usuario */}
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

        </div>
    );
}