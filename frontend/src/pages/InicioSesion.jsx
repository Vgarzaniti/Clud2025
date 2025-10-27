import { Link } from "react-router-dom";

export default function InicioSesion() {
    return (
        <div className="min-h-screen bg-fondo flex flex-col items-center justify-center text-white px-4">

            <div className="bg-panel p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>

                <form className="space-y-4">
                    <div>
                        <input
                        type="text"
                        placeholder="Mail o nombre de usuario"
                        className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-rojoUTN text-white py-3 rounded-full font-semibold hover:bg-red-600 transition"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="text-center mt-4 space-y-2">
                    <Link to="" className="text-azulUTN hover:underline block">
                        ¿Has olvidado tu contraseña?
                    </Link>
                    <p className="text-gray-400">
                        ¿No tenés cuenta?{" "}
                        <Link to="/registrar" className="text-azulUTN font-semibold hover:underline">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}