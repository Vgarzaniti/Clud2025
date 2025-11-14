import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../input.css";
import { foroService } from "../services/foroService";
import { respuestaService } from "../services/respuestaService";

export default function BarraLado({
  carreras = [],
  materias = [],
  filtroCarrera,
  filtroMateria,
  onFiltroCarreraChange,
  onFiltroMateriaChange,
}) {
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);
  const [rankingForos, setRankingForos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // Filtrar materias por carrera seleccionada
  useEffect(() => {
    if (filtroCarrera) {
      const filtradas = materias.filter(
        (m) => m.carrera === parseInt(filtroCarrera)
      );
      setMateriasFiltradas(filtradas);
    } else {
      setMateriasFiltradas(materias);
    }
  }, [filtroCarrera, materias]);

  //Cargar ranking dinámico desde la API
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
    <aside className="w-1/4 space-y-6">
      {/* FILTROS */}
      <div className="bg-panel p-4 rounded-2xl shadow-md border border-gray-600">
        <h2 className="text-lg font-semibold mb-3 text-azulUTN">Filtros</h2>

        {/* Filtro Carrera */}
        <div className="mb-4">
          <p className="font-medium mb-1">Carrera</p>
          <select
            value={filtroCarrera}
            onChange={(e) => onFiltroCarreraChange(e.target.value)}
            className="bg-fondo border border-gray-600 p-2 w-full rounded-lg text-texto"
          >
            <option value="">Todas</option>
            {carreras.map((carrera) => (
              <option key={carrera.idCarrera} value={carrera.idCarrera}>
                {carrera.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Materia */}
        <div className="mb-5">
          <p className="font-medium mb-1">Materia</p>
          <select
            value={filtroMateria}
            onChange={(e) => onFiltroMateriaChange(e.target.value)}
            className="bg-fondo border border-gray-600 p-2 w-full rounded-lg text-texto"
          >
            <option value="">Todas</option>
            {materiasFiltradas.map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RANKING */}
      <div className="bg-panel p-4 rounded-2xl shadow-md border border-gray-600">
        <h2 className="text-lg font-semibold mb-3 text-azulUTN">
          Ranking de Foros
        </h2>

        {cargando ? (
          <p className="text-gray-400 text-sm">Cargando ranking...</p>
        ) : rankingForos.length > 0 ? (
          <ol className="list-decimal ml-4 space-y-2 text-sm text-gray-300">
            {rankingForos.map((foro) => (
              <li
                key={foro.idForo}
                className="leading-snug cursor-pointer hover:text-amber-500 transition"
                onClick={() => navigate(`/foro/${foro.idForo}`)}
              >
                <p className="font-medium text-white truncate">{foro.pregunta}</p>
                <p className="text-gray-400 text-xs">
                  Respuestas: {foro.totalRespuestas}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-400 text-sm">No hay foros con respuestas.</p>
        )}
      </div>
    </aside>
  );
}
