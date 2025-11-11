import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";
import { foroService } from "../services/foroService.js";
import "../input.css";

export default function Materia() {
    const { nombre } = useParams();
    const [mostrarForo, setMostrarForo] = useState(false);
    const [foros, setForos] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");


    const formatoNombre = (texto) => {
        return texto
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }


    useEffect(() => {
        const cargarForos = async () => {
        try {
            const data = await foroService.obtenerTodos();
            
            const forosOrdenados = data
            .filter((foro) => foro.fecha_creacion)
            .sort(
                (a, b) =>
                new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
            );

            setForos(forosOrdenados);

        }catch (error) {
            console.error("Error al cargar los foros:", error);
            setError("Ocurrió un error al cargar los foros.");
        }finally{
            setCarga(false);
        }
        };

        cargarForos();
    }, [])

    if (carga) {
        return (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-400 animate-pulse">Cargando foros...</p>
        </div>
        );
    }

    const foroMateria = foros.filter((foro) => {

  const nombreMateria =
        typeof foro.materia === "string"
        ? foro.materia
        : foro.materia?.nombre || foro.materia_nombre || "";

        return nombreMateria.toLowerCase() === formatoNombre(nombre).toLowerCase();
    });


    const foroBuscador = foros.filter((foro) => 
        foro.pregunta?.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto mt-10 px-6 text-texto">
            

            <h1 className="text-3xl font-semibold mb-6 text-azulUTN">
                Foros de {formatoNombre(nombre)}
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
                {foroBuscador.length > 0 ? (
                    foroBuscador.map((foro) => (
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
                    defaultCarrera="Sistemas"
                    defaultMateria={formatoNombre(nombre)}
                />
            </Modal>
        </div>
    )
}