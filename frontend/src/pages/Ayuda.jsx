import { useState } from "react";
import  { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";

export default function Ayuda() {
    const [faqAbierta, setFaqAbierta] = useState(null);

    const faqs = [
        {
            id: 1,
            pregunta: "¿Cómo creo un nuevo foro o pregunta?",
            respuesta:
                "Podés crear un nuevo foro desde el botón “Publicar Foro”. Si estás dentro de una materia, los campos de carrera y materia se completarán automáticamente.",
        },
        {
            id: 2,
            pregunta: "¿Cómo respondo a una publicación?",
            respuesta:
                "Ingresá al foro que te interesa y presioná el botón “Responder”. Se abrirá una ventana para escribir tu respuesta y adjuntar archivos si es necesario.",
        },
        {
            id: 3,
            pregunta: "¿Cómo funciona el sistema de puntaje?",
            respuesta:
                "Cada respuesta puede recibir votos positivos o negativos según su utilidad. Esto ayuda a destacar las respuestas más útiles y genera un ranking de participación.",
        },
        {
            id: 4,
            pregunta: "¿Puedo editar mis publicaciones o respuestas?",
            respuesta:
                "Sí, podés editar tus publicaciones y respuestas desde tu perfil, en la sección ‘Mi Actividad’. Solo hacé clic en el botón “Editar”.",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 px-6 text-texto">
            <h1 className="text-3xl font-bold text-azulUTN mb-6">Centro de Ayuda</h1>

            <p className="text-gray-300 mb-8">
                En esta sección encontrarás respuestas a las preguntas más frecuentes
                sobre el funcionamiento de la plataforma. Si necesitás más asistencia,
                podés comunicarte con el equipo de soporte al final de esta página.
            </p>

            {/* Sección FAQ */}
            <div className="space-y-4">
                {faqs.map((faq) => (
                <div
                    key={faq.id}
                    className="bg-panel border border-gray-700 rounded-xl p-4 shadow-sm"
                >
                    <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => setFaqAbierta(faqAbierta === faq.id ? null : faq.id)}
                    >
                    <span className="font-semibold text-white">{faq.pregunta}</span>
                    {faqAbierta === faq.id ? (
                        <ChevronUp className="text-gray-400" />
                    ) : (
                        <ChevronDown className="text-gray-400" />
                    )}
                    </button>
                    {faqAbierta === faq.id && (
                    <p className="mt-3 text-gray-300 text-sm">{faq.respuesta}</p>
                    )}
                </div>
                ))}
            </div>

            {/* Guías rápidas */}
            <div className="mt-10 bg-panel border border-gray-700 rounded-xl p-6 space-y-3">
                <h2 className="text-xl font-semibold text-azulUTN">Guías rápidas</h2>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li>📄 Cómo crear un foro paso a paso.</li>
                <li>💬 Buenas prácticas al responder.</li>
                <li>⭐ Cómo obtener mejor puntaje y reputación.</li>
                <li>🛡️ Normas de convivencia y uso del foro.</li>
                </ul>
            </div>

            {/* Contacto */}
            <div className="mt-10 text-center bg-fondo border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-azulUTN mb-2">
                ¿Necesitás más ayuda?
                </h2>
                <p className="text-gray-300 mb-4">
                Podés comunicarte con el equipo de soporte o con un docente
                administrador.
                </p>
                <div className="flex justify-center gap-6">
                <button className="flex items-center gap-2 bg-azulUTN text-white px-4 py-2 rounded-lg hover:bg-blue-500">
                    <Mail size={18} />
                    Enviar correo
                </button>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <MessageCircle size={18} />
                    Chat en línea
                </button>
                </div>
            </div>
        </div>
    );
}