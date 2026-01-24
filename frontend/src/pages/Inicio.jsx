import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { foroService } from "../services/foroService";
import { respuestaService } from "../services/respuestaService";

export default function Inicio() {

    const [rankingForos, setRankingForos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarRanking = async () => {
          try {
            const foros = await foroService.obtenerTodos();
            const respuestas = await respuestaService.obtenerPorTodos();
    
            // Contar respuestas por foro
            const conteo = {};
            (respuestas || []).forEach((r) => {
              const idForo = r.foro;
              conteo[idForo] = (conteo[idForo] || 0) + 1;
            });
    
            // Ordenar por cantidad de respuestas
            const topForos = (foros || [])
              .map((foro) => ({
                ...foro,
                totalRespuestas: conteo[foro.idForo] || 0,
              }))
              .sort((a, b) => b.totalRespuestas - a.totalRespuestas)
              .slice(0, 5);
    
            setRankingForos(topForos);
          } catch (err) {
            console.error("Error al cargar ranking:", err);
          } finally {
            setCargando(false);
          }
        };
    
        cargarRanking();
      }, []);
    
    return (
        <div className="w-full max-w-6xl mx-auto px-6 flex flex-col flex-1">

            <section className="text-center mt-16">
                <h1 className="text-5xl font-extrabold mb-10 text-white">
                    Foro Institucional UTN
                </h1>
                <p className="text-gray-300 text-lg mt-10 mb-20">
                    Entra y conoce a otros alumnos. Comparte tus dudas, proyectos y
                    conocimientos con la comunidad de carreras de Ingeniería.
                </p>
                <Link
                    to="/registrar"
                    className="bg-azulUTN text-white px-10 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
                >
                    Crear cuenta
                </Link>
            </section>
            
            <main className="flex flex-col lg:flex-row justify-between items-start lg:items-center flex-1 px-12 py-20 gap-10">
                
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-extrabold mb-6 text-white">
                        Entra a foros y realiza las consultas que quieras
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Unite a las conversaciones más activas, ayuda a tus compañeros y
                        encontrá soluciones a tus dudas más rápido.
                    </p>
                </div>
                <div  className="bg-panel p-5 rounded-2xl border border-gray-700 w-80 h-fit shadow-md"> 
                    <h2 className="font-semibold text-lg mb-3  text-center text-amber-500">
                        Foros más populares
                    </h2>
                        <ul className="space-y-3">
                            {cargando ? (
                                <p className="text-gray-400 text-sm">Cargando ranking...</p>
                            ) : rankingForos.length > 0 ? (
                                <ol className="list-decimal ml-4 space-y-2 text-l text-gray-300">
                                    {rankingForos.map((foro) => (
                                        <li
                                            key={foro.idForo}
                                            className="leading-snug hover:text-amber-500 transition mb-2"
                                        >
                                            <p className="font-medium text-white truncate mb-2">{foro.pregunta}</p>
                                            <p className="text-gray-400 text-sm">
                                                Respuestas: {foro.totalRespuestas}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-400 text-sm">No hay foros con respuestas.</p>
                            )}
                        </ul>
                </div>
            </main>
        </div>
    );
}