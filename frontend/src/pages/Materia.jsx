import { useParams } from "react-router-dom";
import { useState } from "react";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import CrearForo from "../components/CrearForo.jsx";
import Modal from "../components/Modal.jsx";

export default function Materia() {
    const { nombre } = useParams();
    const [mostrarForo, setMostrarForo] = useState(false);

    const formatoNombre = (texto) => {
        return texto
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const foros = [
        {
            id: 1,
            titulo: "Consulta sobre prácticas de laboratorio",
            descripcion: "¿Cómo se entrega el informe de la segunda práctica?",
            autor: "María López",
            respuestas: 4,
        },
        {
            id: 2,
            titulo: "Errores en simulación de red",
            descripcion: "¿A alguien más le da error en Packet Tracer al conectar el router?",
            autor: "Luis Díaz",
            puntaje: 2,
        }, 
    ];

    return (
        <div className="max-w-7xl mx-auto mt-10 px-6 text-texto">
            <h1 className="text-3xl font-semibold mb-6 text-azulUTN">
                Foros de {formatoNombre(nombre)}
            </h1>

            <hr className="w-3/4 mx-auto border-t-2 border-gray-700" />

            <div className="flex">
                <button 
                    onClick={()=> setMostrarForo(true)}
                    className="bg-azulUTN text-white px-10 mt-3 py-2 rounded-lg hover:bg-blue-600 ml-auto">
                    Publicar Foro
                </button>
            </div>
                

            <div className="space-y-4 mt-5"> 
                {foros.map((foro) => (
                    <ForoTarjeta key={foro.id} foro={foro} />
                ))}
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