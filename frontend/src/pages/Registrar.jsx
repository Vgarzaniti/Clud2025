import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombreCompleto: "",
        nombreUsuario: "",
        email: "",
        password: "",
        confirmarPassword: ""
    });

    const [errores, setErrores] = useState({});
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.nombreCompleto.trim()) nuevosErrores.nombreCompleto = "El nombre completo es obligatorio.";
        if (!formData.nombreUsuario.trim()) nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio.";

        if (!emailRegex.test(formData.email))
        nuevosErrores.email = "El formato del correo no es válido.";

        if (!passwordRegex.test(formData.password))
            nuevosErrores.password =
            "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.";

        if (formData.password !== formData.confirmarPassword)
            nuevosErrores.confirmarPassword = "Las contraseñas no coinciden.";

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    const password = formData.password;

    const requisitosContraseña = {
        length: password.length >= 8,
        mayuscula: /[A-Z]/.test(password),
        minuscula: /[a-z]/.test(password),
        numero: /\d/.test(password),
        especial: /[@$!%*?&]/.test(password),
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            console.log("Datos registrados:", formData);
            alert("Registro exitoso");
            
            navigate("/home");
        }
    }
    
    return (
        <div className="min-h-screen bg-fondo flex flex-col items-center justify-center text-white px-4">

            <div className="bg-panel p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">Registrarse</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    <div>
                        <input
                            type="text"
                            name="nombreCompleto"
                            placeholder="Nombre completo"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                        {
                            errores.nombreCompleto && (
                                <p className="text-red-400 text-sm mt-1">{errores.nombreCompleto}</p>
                            )
                        }
                    </div>

                    <div>
                        <input
                            type="text"
                            name="nombreUsuario"
                            placeholder="Nombre de usuario"
                            value={formData.nombreUsuario}
                            onChange={handleChange}
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                        {
                            errores.nombreUsuario && (
                                <p className="text-red-400 text-sm mt-1">{errores.nombreUsuario}</p>
                            )
                        }
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Mail"
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
                            type={mostrarContrasena? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                            {mostrarContrasena ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                        </button>
                        {
                            errores.password && (
                                <p className="text-red-400 text-sm mt-1">{errores.password}</p>
                            )
                        }

                        <ul className="mt-2 text-sm space-y-1">
                            <li className={requisitosContraseña.length ? "text-green-400" : "text-red-400"}>
                            • Mínimo 8 caracteres
                            </li>
                            <li className={requisitosContraseña.mayuscula ? "text-green-400" : "text-red-400"}>
                            • Al menos una letra mayúscula
                            </li>
                            <li className={requisitosContraseña.minuscula ? "text-green-400" : "text-red-400"}>
                            • Al menos una letra minúscula
                            </li>
                            <li className={requisitosContraseña.numero ? "text-green-400" : "text-red-400"}>
                            • Al menos un número
                            </li>
                            <li className={requisitosContraseña.especial ? "text-green-400" : "text-red-400"}>
                            • Al menos un símbolo especial (@ $ ! % * ? &)
                            </li>
                        </ul>
                    </div>
                    
                    <div className="relative">
                        <input
                            type={mostrarConfirmarContrasena ? "text" : "password"}
                            name="confirmarPassword"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmarPassword}
                            onChange={handleChange}
                            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-azulUTN placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)
                            }
                            className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                            {mostrarConfirmarContrasena ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                        </button>
                        {
                            errores.confirmarPassword && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errores.confirmarPassword}
                                </p>
                            )
                        }
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-rojoUTN text-white py-3 rounded-full font-semibold bg-violet-800 hover:bg-violet-950 transition"
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