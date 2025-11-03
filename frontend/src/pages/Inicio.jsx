import { Link } from "react-router-dom";

export default function Inicio() {

    const forosPopulares = [
        { id: 1, nombre: "Ingeniería de Software", respuestas: 120 },
        { id: 2, nombre: "Redes y Comunicaciones", respuestas: 95 },
        { id: 3, nombre: "Bases de Datos", respuestas: 80 },
        { id: 4, nombre: "Inteligencia Artificial", respuestas: 75 },
        { id: 5, nombre: "Desarrollo Web", respuestas: 60 },
    ];
    
    return (
        <div className="w-full max-w-6xl mx-auto px-6 flex flex-col flex-1">

            <section className="text-center mt-16">
                <h1 className="text-5xl font-extrabold mb-10 text-white">
                    Foro Institucional UTN
                </h1>
                <p className="text-gray-300 text-lg mt-10 mb-20">
                    Entra y conoce a otros alumnos. Comparte tus dudas, proyectos y
                    conocimientos con la comunidad de carreras de Ingeniería.
                </p>
                <Link
                    to="/registrar"
                    className="bg-azulUTN text-white px-10 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
                >
                    Crear cuenta
                </Link>
            </section>
            
            <main className="flex flex-col lg:flex-row justify-between items-start lg:items-center flex-1 px-12 py-20 gap-10">
                
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-extrabold mb-6 text-white">
                        Entra a foros y realiza las consultas que quieras
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Unite a las conversaciones más activas, ayuda a tus compañeros y
                        encontrá soluciones a tus dudas más rápido.
                    </p>
                </div>
                <div  className="bg-panel p-6 rounded-2xl border border-gray-700 w-80 h-fit shadow-md"> 
                    <h2 className="font-semibold text-lg mb-4 text-center">
                        Foros más populares
                    </h2>
                        <ul className="space-y-3">
                            {forosPopulares.map((foro) => (
                            <li key={foro.id} className="flex items-center gap-3">
                                <div>
                                    <p className="font-semibold">{foro.nombre}</p>
                                    <p className="text-sm text-gray-400">
                                        Respuestas: {foro.respuestas}
                                    </p>
                                </div>
                            </li>
                            ))}
                        </ul>
                </div>
            </main>
        </div>
    );
}