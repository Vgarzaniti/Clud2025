import { useState, useEffect, useMemo } from "react";
import BarraLado from "../components/BarraLado.jsx";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";
import { foroService } from "../services/foroService.js";
import { carreraService } from "../services/carreraService.js";
import { materiaService } from "../services/materiaService.js";
import "../input.css";

export default function Home() {
  const [mostrarForo, setMostrarForo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [foros, setForos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [carga, setCarga] = useState(true);
  const [error, setError] = useState(null);

  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataForos, dataCarreras, dataMaterias] = await Promise.all([
          foroService.obtenerTodos(),
          carreraService.obtenerTodos(),
          materiaService.obtenerTodos(),
        ]);

        const forosOrdenados = dataForos
          .filter((foro) => foro.fecha_creacion)
          .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

        setForos(forosOrdenados);
        setCarreras(dataCarreras);
        setMaterias(dataMaterias);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        setError("Error al cargar datos del servidor.");
      } finally {
        setCarga(false);
      }
    };

    cargarDatos();
  }, []);

  const forosEnriquecidos = useMemo(() => {
    if (!foros.length || !materias.length) return [];

    return foros.map((foro) => {
      const materiaInfo = materias.find((m) => m.idMateria === foro.materia);
      const carreraInfo = carreras.find(
        (c) => c.idCarrera === materiaInfo?.carrera
      );
      return {
         ...foro,
          materia_nombre: materiaInfo?.nombre || "Sin materia",
          carrera_nombre: carreraInfo?.nombre || "Sin carrera",
          carreraId: carreraInfo?.idCarrera,
          materiaId: materiaInfo?.idMateria,
      };
    });
  }, [foros, materias, carreras]);


  const materiasFiltradas = useMemo(() => {
    if (!filtroCarrera) return materias;
    return materias.filter((m) => m.carrera === parseInt(filtroCarrera));
  }, [materias, filtroCarrera]);


  const forosFiltrados = useMemo(() => {
    return forosEnriquecidos.filter((foro) => {
      const coincideBusqueda = foro.pregunta
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCarrera =
        !filtroCarrera ||
        foro.carreraId === parseInt(filtroCarrera);

      const coincideMateria =
        !filtroMateria ||
        foro.materiaId === parseInt(filtroMateria);

      return coincideBusqueda && coincideCarrera && coincideMateria;
    });
  }, [forosEnriquecidos, busqueda, filtroCarrera, filtroMateria]);


  return (
    <div className="max-w-7xl mx-auto mt-10 px-6 flex gap-6">
      <BarraLado
        carreras={carreras}
        materias={materiasFiltradas}
        foros={forosEnriquecidos}
        filtroCarrera={filtroCarrera}
        filtroMateria={filtroMateria}
        onFiltroCarreraChange={setFiltroCarrera}
        onFiltroMateriaChange={setFiltroMateria}
      />

      <main className="flex-1 space-y-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar Foro..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-panel border border-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg flex-1"
          />
          <button
            onClick={() => setMostrarForo(true)}
            className="bg-azulUTN text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Publicar
          </button>
        </div>

        {carga && <p className="text-gray-400">Cargando foros...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {forosFiltrados.length > 0 ? (
            forosFiltrados.map((foro) => (
              <ForoTarjeta key={foro.idForo} foro={foro} />
            ))
          ) : (
            <p className="text-gray-400">No se encontraron foros.</p>
          )}
        </div>
      </main>

      <Modal visible={mostrarForo} onClose={() => setMostrarForo(false)}>
        <CrearForo
          onClose={() => setMostrarForo(false)}
          carreraSeleccionada={filtroCarrera}
          materiaSeleccionada={filtroMateria}
        />
      </Modal>
    </div>
  );
}
