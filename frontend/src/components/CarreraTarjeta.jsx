import { useState, useEffect } from "react";
import MateriaTarjeta from "./MateriaTarjeta.jsx";
import { materiaService } from "../services/materiaService.js";

export default function CarreraTarjeta({ carrera }) {
    const [materias, setMaterias] = useState([]);
    const [filtroAno, setFiltroAno] = useState(null);
    const [mostrarTodo, setMostrarTodo] = useState(false);

    useEffect(() => {
        const cargarMaterias = async () => {
        try {
            const todas = await materiaService.obtenerPorCarrera(carrera.idCarrera);
            setMaterias(todas);
        } catch (error) {
            console.error("Error al cargar materias:", error);
        }
        };
        cargarMaterias();
    }, [carrera.idCarrera]);

    const materiasFiltradas = filtroAno
        ? materias.filter((m) => m.ano === filtroAno)
        : materias;

    const materiasVisibles = mostrarTodo
        ? materiasFiltradas
        : materiasFiltradas.slice(0, 8);

    return (
        <section className="mb-10">
        <h2 className="text-xl mt-5 font-bold mb-4 text-white">
            {carrera.nombre}
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((ano) => (
            <button
                key={ano}
                onClick={() => setFiltroAno(filtroAno === ano ? null : ano)}
                className={`px-4 py-1 rounded-full border transition ${
                filtroAno === ano
                    ? "bg-azulUTN text-white border-azulUTN"
                    : "bg-fondo border-gray-600 hover:bg-gray-800"
                }`}
            >
                {ano}° Año
            </button>
            ))}

            <button
                onClick={() => setFiltroAno(null)}
                className="px-4 py-1 rounded-full border border-gray-600 hover:bg-gray-800 transition"
            >
                Ver todas
            </button>
        </div>

        {/* Materias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
            {materiasVisibles.map((m) => (
                <MateriaTarjeta key={m.idMateria} nombre={m.nombre} />
            ))}
        </div>

        {materiasFiltradas.length > 8 && (
            <div className="text-center">
                <button
                    onClick={() => setMostrarTodo(!mostrarTodo)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-full text-sm transition"
                >
                    {mostrarTodo ? "Mostrar menos" : "Mostrar más"}
                </button>
            </div>
        )}
        </section>
    );
}
