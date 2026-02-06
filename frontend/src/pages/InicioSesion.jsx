import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function InicioSesion() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [carga, setCarga] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errores, setErrores] = useState({});
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!emailRegex.test(formData.email)) {
            nuevosErrores.email = "El formato del correo no es válido.";
        }

        if (!formData.password) {
            nuevosErrores.password = "La contraseña es obligatoria";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);

        if (!validarFormulario()) return;

        try {

            setCarga(true);

            await login(formData.email, formData.password);
            
            setMensaje({
                tipo: "ok",
                texto: "Inicio de sesión exitoso"
            });

            setTimeout(() => navigate("/home"), 1200);
    
        } catch (error) {
            
            setMensaje({
            tipo: "error",
            texto:
                "Credenciales incorrectas. Intente nuevamente."
            });
            
            const mensaje =
                error.response?.data?.non_field_errors?.[0] ||
                "Credenciales inválidas. Intete nuevamente.";

            setErrores({ general: mensaje });
        } finally {
            setCarga(false);
        }
    };



    return (
        <div className="min-h-screen bg-fondo flex flex-col items-center justify-center text-white px-4">

            <div className="bg-panel p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-2">Iniciar Sesión</h1>

                <p className="text-center mt-4 space-y-2 text-gray-400 mb-4">Si ya tienes una cuenta, inicia sesión nuevamente.</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Mail de usuario"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                        {
                            errores.email && (
                                <p className="text-red-400 text-sm mt-1">{errores.email}</p>
                            )
                        }
                    </div>
                    <div className="relative">
                        <input
                            name="password"
                            type={mostrarContrasena? "text" : "password"}
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
                        >
                            {mostrarContrasena ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                        </button>
                        {
                            errores.password && (
                                <p className="text-red-400 text-sm mt-1">{errores.password}</p>
                            )
                        }
                    </div>

                    <button
                        type="submit"
                        disabled={carga}
                        className={`w-full py-3 rounded-full font-semibold transition
                            ${carga
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-violet-800 hover:bg-violet-950"}
                        `}
                    >
                        {carga ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>

                </form>

                {mensaje && (
                    <p
                        className={`text-center mt-3 text-sm font-medium
                            ${mensaje.tipo === "ok" ? "text-green-400" : "text-red-400"}
                        `}
                    >
                        {mensaje.texto}
                    </p>
                )}

                <div className="text-center mt-4 space-y-2">
                    <Link to="/olvidar-contrasena" className="text-azulUTN hover:underline block">
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