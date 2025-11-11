import { useParams } from "react-router-dom";
import { useState } from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";

export default function Materia() {
    const { nombre } = useParams();
    const [mostrarForo, setMostrarForo] = useState(false);
    const [busqueda, setBusqueda] = useState("");


    const formatoNombre = (texto) => {
        return texto
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const foros = [
        {
            id: 1,
            pregunta: "Consulta sobre prácticas de laboratorio",
            autor: "María López",
            respuestas: 4,
        },
        {
            id: 2,
            pregunta: "Errores en simulación de red",
            autor: "Luis Díaz",
            respuestas: 2,
        }, 
    ];

    const foroBuscador = foros.filter((foro) => 
        foro.pregunta.toLowerCase().includes(busqueda.toLowerCase())
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