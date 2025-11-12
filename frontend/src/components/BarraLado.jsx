import { useEffect, useState, useMemo } from "react";
import "../input.css";

export default function BarraLado({
  carreras = [],
  materias = [],
  foros = [],
  filtroCarrera,
  filtroMateria,
  onFiltroCarreraChange,
  onFiltroMateriaChange,
}) {
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);


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


  const rankingForos = useMemo(() => {
    if (!foros || foros.length === 0) return [];
    return [...foros]
      .filter((f) => f.respuestas && f.respuestas.length > 0)
      .sort((a, b) => b.respuestas.length - a.respuestas.length)
      .slice(0, 5);
  }, [foros]);

  return (
    <aside className="w-1/4 space-y-6">

      <div className="bg-panel p-4 rounded-2xl shadow-md border border-gray-600">
        <h2 className="text-lg font-semibold mb-3 text-azulUTN">Filtros</h2>


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

      <div className="bg-panel p-4 rounded-2xl shadow-md border border-gray-600">
        <h2 className="text-lg font-semibold mb-3 text-azulUTN">
          Ranking de Foros
        </h2>

        {rankingForos.length > 0 ? (
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
            {rankingForos.map((foro) => (
              <li key={foro.idForo} className="leading-snug">
                <p className="font-medium text-white truncate">
                  {foro.pregunta}
                </p>
                <p className="text-gray-400 text-xs">
                  Respuestas: {foro.respuestas.length}
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
