import { useParams } from "react-router-dom";
import RespuestaTarjeta from "../components/RespuestaTarjeta.jsx";

export default function ForoDetalle() {
    const { foroId } = useParams();

    const foro = {
        foroId: foroId,
        titulo: "¿Cómo optimizar algoritmos de búsqueda?",
        descripcion: "Estoy trabajando en un proyecto donde necesito optimizar un algoritmo de búsqueda. ¿Qué técnicas recomiendan?",
        autor: "Juan Pérez",
        fecha: "15 de Octubre, 2025",
        materia: "Programación II",
    }

    const respuestas = [
    {
      id: 1,
      autor: "Ana Gómez",
      respuesta:
        "Podrías usar estructuras de datos más eficientes como árboles balanceados o índices hash. También revisar la complejidad O(n).",
      puntaje: 12,
      archivo: "optimizacion.pdf",
    },
    {
      id: 2,
      autor: "Luis Díaz",
      respuesta:
        "En mi caso, mejoré bastante el rendimiento usando búsquedas binarias cuando los datos están ordenados.",
      puntaje: 5,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 text-texto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-4">
            
            {/* Pregunta principal */}
            <div className="bg-cyan-950 p-5 rounded-2xl border border-gray-700 shadow-md">
                <h1 className="text-2xl font-bold mb-2">{foro.titulo}</h1>
                <p className="text-gray-300 mb-3">{foro.descripcion}</p>
            </div>

            {/* Filtros */}
            <div className="flex gap-3">
            <button className="bg-sky-950 border border-gray-600 px-3 py-1 rounded-full hover:bg-gray-800">
                Filtros
            </button>
            <button className="bg-sky-950 border border-gray-600 px-3 py-1 rounded-full hover:bg-gray-800">
                Ranking
            </button>
            </div>

            {/* Lista de respuestas */}
            {respuestas.map((res) => (
            <RespuestaTarjeta key={res.id} respuesta={res} />
            ))}
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-4">
            {/* Botón fuera del panel */}
            <button
                className="w-full bg-azulUTN text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition text-lg shadow-lg"
            >
                Responder
            </button>

            {/* Panel de información */}
            <aside className="bg-panel p-4 rounded-2xl border border-gray-700 h-fit space-y-4">
                <div className="border border-gray-600 rounded-lg p-3">
                <h3 className="font-semibold mb-2 text-azulUTN">Información del Foro</h3>
                <p>
                    <span className="font-semibold">Materia:</span> {foro.materia}
                </p>
                <p>
                    <span className="font-semibold">Autor:</span> {foro.autor}
                </p>
                <p>
                    <span className="font-semibold">Fecha:</span> {foro.fecha}
                </p>
                </div>
            </aside>
        </div>
    </div>
  );
}