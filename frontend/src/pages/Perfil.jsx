import { useState } from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import RespuestaTarjeta from "../components/RespuestaTarjeta.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function Perfil() {
    const [vista, setVista] = useState("foros");

    const usuario = {
        nombre: "Juan Pérez",
        username: "jperez",
        email: "juanperez@utn.edu.ar",
    };

    const foros = [
        {
            id: 1,
            titulo: "Optimización de algoritmos de búsqueda",
            descripcion:
                "Consulta sobre cómo mejorar el rendimiento en estructuras de datos.",
            autor: "Juan Pérez",
            respuestas: 10,
        },
        {
            id: 2,
            titulo: "Errores al compilar en Visual Studio",
            descripcion: "¿Alguien tuvo el mismo problema al compilar proyectos?",
            autor: "Juan Pérez",
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
            archivo: "compilador-fix.txt",
        },
        {
            id: 2,
            autor: "Juan Pérez",
            respuesta:
                "En mi experiencia, usar índices mejora mucho el rendimiento de consultas SQL grandes.",
            puntaje: 5,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
            {/* Columna lateral: perfil */}
            <aside className=" bg-perfilPanel p-8 pt-20 mt-10 rounded-2xl border border-gray-700 relative w-72 mx-auto">
                
                <div className="shadow-gray-900 shadow-lg w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-fondo absolute -top-12 left-1/2 transform -translate-x-1/2">
                    US
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
                    <button className="bg-sky-950 border border-gray-600 py-2 rounded-lg hover:bg-gray-800">
                        Editar
                    </button>
                    <button className="bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition">
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-semibold mb-2 text-azulUTN">
                    Mi Actividad
                </h1>

                {/* Selector de vista */}
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setVista("foros")}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                        vista === "foros"
                            ? "bg-azulUTN text-white"
                            : "bg-fondo border border-gray-600 hover:bg-gray-800"
                        }`}
                    >
                        Foros creados
                    </button>
                    <button
                        onClick={() => setVista("respuestas")}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                        vista === "respuestas"
                            ? "bg-azulUTN text-white"
                            : "bg-fondo border border-gray-600 hover:bg-gray-800"
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
                                <ForoTarjeta key={foro.id} foro={foro} />
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
                                <RespuestaTarjeta key={res.id} respuesta={res} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}