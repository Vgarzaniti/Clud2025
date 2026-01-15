import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InicioSesion() {

    const navigate = useNavigate();

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!emailRegex.test(formData.email))
            nuevosErrores.email = "El formato del correo no es válido.";

        if (!passwordRegex.test(formData.password))
            nuevosErrores.password =
            "La contraseña es incorrecta.";
        
        if (!formData.password)
            nuevosErrores.password = "La contraseña es obligatoria";

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        try {
            const response = await fetch("https://clud2025.onrender.com/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: true,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || "Error al iniciar sesión");
            }

            // Guardar tokens
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            navigate("/home");

        } catch (error) {
            setErrores({ general: error.message });
        }
    };


    return (
        <div className="min-h-screen bg-fondo flex flex-col items-center justify-center text-white px-4">

            <div className="bg-panel p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>

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
                                <p className="text-red-400 text-sm mt-1">{errores.mail}</p>
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
                        className="w-full bg-rojoUTN text-white py-3 rounded-full font-semibold bg-violet-800 hover:bg-violet-950 transition"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                {errores.general && (
                    <p className="text-red-400 text-center mt-2">{errores.general}</p>
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