import MateriaTarjeta from './MateriaTarjeta.jsx';
import { useState } from 'react';

export default function CarreraTarjeta({ carrera }) {
    const [mostrarTodo, setMostrarTodo] = useState(false);
    const materiasVisibles = mostrarTodo
        ? carrera.materias
        : carrera.materias.slice(0, 8);

    return (
        <section>
            <h2 className="text-xl mt-5 font-bold mb-4">{carrera.nombre}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                {materiasVisibles.map((nombre, i) => (
                <MateriaTarjeta key={i} nombre={nombre} />
                ))}
            </div>

            {carrera.materias.length > 8 && (
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
    )
}