import { useParams } from "react-router-dom";
import ForoTarjeta from "../components/ForoTarjeta.jsx";

export default function Materia() {
    const { nombre } = useParams();

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
        <div className="max-w-5xl mx-auto mt-8 text-texto">
            <h1 className="text-3xl font-semibold mb-6 text-azulUTN">
                Foros de {formatoNombre(nombre)}
            </h1>

            <hr className="w-3/4 mx-auto border-t-2 border-gray-700" />

            <div className="space-y-4 mt-5">
                {foros.map((foro) => (
                    <ForoTarjeta key={foro.id} foro={foro} />
                ))}
            </div>
        </div>
    )
}