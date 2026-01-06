import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo} from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";
import { foroService } from "../services/foroService.js";
import { materiaService } from "../services/materiaService.js";
import "../input.css";

export default function Materia() {
    const { nombre } = useParams();
    const [mostrarForo, setMostrarForo] = useState(false);
    const [foros, setForos] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [materiaActual, setMateriaActual] = useState(null);

    const formatoNombre = (texto) => {
        return texto
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [dataForos, dataMaterias] = await Promise.all([
                    foroService.obtenerTodos(),
                    materiaService.obtenerTodos(),
                ]);

                const materiaEncontrada = dataMaterias.find(
                    (m) => formatoNombre(m.nombre) === formatoNombre(nombre)
                );

                setMateriaActual(materiaEncontrada);

                setForos(
                dataForos
                    .filter((f) => f.fecha_creacion)
                    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
                );

            } catch (error) {

                console.error("Error al cargar datos:", error);
                setError("Ocurrió un error al cargar los foros o materias.");

            } finally {

                setCarga(false);

            }
        };
        cargarDatos();
    },);

    const forosPorMateria = useMemo(() => {
        if (!materiaActual) return [];

        return foros.filter(
            (foro) => foro.materia === materiaActual.idMateria
        );
        
    }, [foros, materiaActual]);

    const forosFiltrados = useMemo(() => {
        return forosPorMateria.filter((foro) =>
            foro.pregunta?.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [forosPorMateria, busqueda]);

    const handleForoCreado = (foroNuevo) => {
        setForos((prev) => [foroNuevo, ...prev]);
    };

    if (carga) {
        return (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-400 animate-pulse">Cargando foros...</p>
        </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 px-6 text-texto">
            
            <h1 className="text-3xl font-semibold mb-6 text-azulUTN">
                Foros de {formatoNombre(nombre).replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>

            <hr className="w-3/4 mx-auto border-t-2 border-gray-700" />

            <div className="flex">
                <input
                    type="text"
                    placeholder="Buscar Foro"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)} 
                    className="bg-panel border border-gray-700 text-white placeholder-gray-400 px-5 py-2 mt-3 mr-5 rounded-lg flex-1"
                />
                <button 
                    onClick={()=> setMostrarForo(true)}
                    className="bg-azulUTN text-white px-10 mt-3 py-2 rounded-lg hover:bg-blue-600 ml-auto">
                    Publicar Foro
                </button>
            </div>
            
            {error && <p className="text-red-500 mt-3">{error}</p>}

            <div className="space-y-4 mt-5"> 
                {forosFiltrados.length > 0 ? (
                    forosFiltrados.map((foro) => (
                        <ForoTarjeta key={foro.idForo} foro={foro} />
                    ))
                ) : (
                    <p className="text-gray-400">No se encontraron foros con ese título.</p>
                )}
            </div>

            {/*Mostar Modal para Foro*/}
            <Modal visible={mostrarForo} onClose={() => setMostrarForo(false)}>
                <CrearForo 
                    onClose={() => setMostrarForo(false)} 
                    onForoCreado={handleForoCreado}
                    materiaSeleccionada={materiaActual?.idMateria}
                />
            </Modal>
        </div>
    )
}