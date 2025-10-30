import { useState } from "react";
import { Link } from "react-router-dom";

export default function OlvidarContrasena() {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
        setError("Por favor, ingresá un correo válido.");
        setMensaje("");
        return;
        }

        // Simulación de envío (sin backend)
        console.log("Enviando enlace de recuperación a:", email);
        setError("");
        setMensaje(
            "Si el correo existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña."
        );
        setEmail("");
    };

    return (
        <div className="min-h-screen bg-fondo flex flex-col items-center justify-center text-white px-4">
            <div className="bg-panel p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Recuperar contraseña
                </h1>

                <p className="text-gray-300 text-center mb-6 text-sm">
                    Ingresá tu correo electrónico para recibir un enlace de recuperación.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                    />

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {mensaje && <p className="text-green-400 text-sm">{mensaje}</p>}

                    <button
                        type="submit"
                        className="w-full bg-rojoUTN text-white py-3 rounded-full font-semibold bg-violet-800 hover:bg-violet-950 transition"
                    >
                        Enviar enlace
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link
                        to="/inicio-sesion"
                        className="text-azulUTN font-semibold hover:underline"
                    >
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
