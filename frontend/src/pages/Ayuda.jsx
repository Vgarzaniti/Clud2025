import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FilePlus,
  MessageSquare,
  Star,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Mail,
  MessageCircle,
} from "lucide-react";


export default function Ayuda() {
    const [faqAbierta, setFaqAbierta] = useState(null);
    const [guiaAbierta, setGuiaAbierta] = useState(null);

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
                "Sí, podés editar tus publicaciones y respuestas desde tu perfil, en la sección ‘Mi Actividad’.",
        },
    ];

    const guias = [
        {
            id: 1,
            titulo: "Cómo crear un foro paso a paso",
            icono: <FilePlus size={18} />,
            contenido: [
                "Ingresá a la materia correspondiente.",
                "Presioná el botón “Publicar Foro”.",
                "Escribí un título claro y descriptivo.",
                "Detallá tu consulta o problema.",
                "Adjuntá archivos si es necesario.",
                "Publicá el foro y esperá respuestas.",
            ],
        },
        {
            id: 2,
            titulo: "Buenas prácticas al responder",
            icono: <MessageSquare size={18} />,
            contenido: [
                "Leé atentamente la consulta antes de responder.",
                "Sé claro y concreto en tu explicación.",
                "Usá ejemplos o archivos cuando sea necesario.",
                "Mantené siempre un trato respetuoso.",
                "Evitá respuestas fuera de tema.",
            ],
        },
        {
            id: 3,
            titulo: "Cómo obtener mejor puntaje y reputación",
            icono: <Star size={18} />,
            contenido: [
                "Respondé preguntas de forma clara y útil.",
                "Aportá soluciones completas, no solo fragmentos.",
                "Respondé con rapidez cuando conozcas el tema.",
                "Evitá contenido repetido o poco relevante.",
                "Las respuestas bien valoradas aumentan tu reputación.",
            ],
        },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 px-6 text-texto pb-5">
            <h1 className="text-3xl font-bold text-azulUTN mb-6">Centro de Ayuda</h1>

            <hr className="w-3/4 mx-auto border-t-2 border-gray-700 mb-8" />


            <p className="text-gray-300 mb-8">
                En esta sección encontrarás respuestas a las preguntas más frecuentes
                sobre el funcionamiento de la plataforma. Si necesitás más asistencia,
                podés comunicarte con el equipo de soporte al final de esta página.
            </p>

            <p className="text-gray-300 mb-8">
                Encontrá respuestas a las preguntas más frecuentes sobre el uso de la
                plataforma. También te dejamos recomendaciones importantes sobre carga
                de archivos y normas de convivencia.
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
                <h2 className="text-xl font-semibold text-azulUTN mb-4">
                    Guías rápidas
                </h2>

                <div className="space-y-3">
                    {guias.map((guia) => (
                    <div
                        key={guia.id}
                        className="border border-gray-700 rounded-lg p-4"
                    >
                        <button
                            className="w-full flex justify-between items-center text-left"
                            onClick={() =>
                                setGuiaAbierta(guiaAbierta === guia.id ? null : guia.id)
                            }
                        >
                        <div className="flex items-center gap-2 text-white font-medium">
                            {guia.icono}
                            {guia.titulo}
                        </div>

                        {guiaAbierta === guia.id ? (
                            <ChevronUp className="text-gray-400" />
                        ) : (
                            <ChevronDown className="text-gray-400" />
                        )}
                        </button>

                        {guiaAbierta === guia.id && (
                        <ol className="mt-4 list-decimal list-inside text-gray-300 text-sm space-y-1">
                            {guia.contenido.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                        )}
                    </div>
                    ))}
                </div>
            </div>

            {/* Archivos adjuntos */}
            <div className="mt-10 bg-panel border border-blue-600/40 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-azulUTN flex items-center gap-2">
                <FileText size={20} />
                    Archivos adjuntos
                </h2>

                <ul className="mt-4 text-gray-300 text-sm space-y-2 list-disc list-inside">
                    <li>Formatos permitidos: <strong>PDF, DOCX, JPG</strong></li>
                    <li>Tamaño máximo por archivo: <strong>5 MB</strong></li>
                    <li>Tamaño máximo en total por respuesta o foro: <strong>20 MB</strong></li>
                    <li>Podés adjuntar más de un archivo por publicación.</li>
                </ul>

                <div className="mt-4 flex gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-200">
                    <AlertTriangle size={20} />
                    <p>
                        Si no podés cargar un archivo, intentá cambiar el formato o reducir
                        su tamaño antes de volver a intentarlo.
                    </p>
                </div>
            </div>

            {/* Normas de convivencia */}
            <div className="mt-10 bg-panel border border-green-600/40 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    Normas de convivencia
                </h2>

                <ul className="mt-4 text-gray-300 text-sm space-y-2 list-disc list-inside">
                    <li>Respetá a todos los miembros de la comunidad</li>
                    <li>No publiques contenido ofensivo o discriminatorio.</li>
                    <li>Mantené las discusiones dentro del tema del foro.</li>
                    <li>No compartas información personal sensible.</li>
                    <li>El incumplimiento puede derivar en moderación.</li>
                </ul>
            </div>

            {/* Contacto */}
            <div className="mt-10 text-center bg-fondo border border-gray-700 rounded-xl p-6 pb-5">
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