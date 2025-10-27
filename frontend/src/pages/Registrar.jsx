import { Link } from "react-router-dom";

export default function Register() {
  return (
        <div className="min-h-screen bg-fondo flex flex-col items-center justify-center text-white px-4">

            <div className="bg-panel p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">Registrarse</h1>

                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                    />
                    <input
                        type="email"
                        placeholder="Mail"
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                    />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-rojoUTN text-white py-3 rounded-full font-semibold hover:bg-red-600 transition"
                    >
                        Registrarse
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-400">
                        ¿Ya tenés una cuenta?{" "}
                        <Link to="/inicio-sesion" className="text-azulUTN font-semibold hover:underline">
                            Iniciá sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}