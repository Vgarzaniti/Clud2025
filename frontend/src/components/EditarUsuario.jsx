import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import userService from "../services/userService.js";
import { useNavigate } from "react-router-dom";

export default function EditarUsuario({ usuarioActual, onSave, onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  });

  const navigate = useNavigate();
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useEffect(() => {
    if (usuarioActual) {
      setFormData((prev) => ({
        ...prev,
        username: usuarioActual.username || "",
      }));
    }
  }, [usuarioActual]);

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.username.trim()) {
      nuevosErrores.username = "El nombre de usuario es obligatorio.";
    }

    if (formData.passwordNueva) {
      if (!formData.passwordActual) {
        nuevosErrores.passwordActual =
          "Debes ingresar tu contraseña actual.";
      }

      if (formData.passwordNueva.length < 8) {
        nuevosErrores.passwordNueva =
          "La contraseña debe tener al menos 8 caracteres.";
      }

      if (formData.passwordNueva !== formData.confirmarPassword) {
        nuevosErrores.confirmarPassword = "Las contraseñas no coinciden.";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      setCargando(true);

      const payload = {
        username: formData.username,
      };

      if (formData.passwordNueva) {
        payload.passwordActual = formData.passwordActual;
        payload.passwordNueva = formData.passwordNueva;
      }

      await userService.cambiarDatos(payload);

      onSave({
        ...usuarioActual,
        username: formData.username,
      });

      alert("Perfil actualizado correctamente.");

      if (formData.passwordNueva) {
        alert("Contraseña actualizada. Iniciá sesión nuevamente.");
        localStorage.clear();
        navigate("/inicio-sesion");
      }

      onClose();
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);

      const data = error.response?.data;

      // 🔥 MENSAJE ESPECÍFICO SIN TOCAR BACKEND
      if (formData.passwordNueva) {
        alert("La contraseña actual no es correcta.");
      } else {
        alert("No se pudieron actualizar los datos.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white w-full max-w-md">
      <h2 className="text-xl font-semibold text-center">Editar Perfil</h2>

      {/* Nombre completo */}
      <div>
        <label className="block mb-1">Nombre Completo</label>
        <input
          type="text"
          value={usuarioActual.nombreYapellido}
          disabled
          className="w-full p-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1">Correo Electrónico</label>
        <input
          type="email"
          value={usuarioActual.email}
          disabled
          className="w-full p-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block mb-1">Nombre de Usuario</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className={`w-full p-2 rounded-xl bg-fondo border ${
            errores.username ? "border-red-500" : "border-gray-600"
          }`}
        />
        {errores.username && (
          <p className="text-red-500 text-sm mt-1">{errores.username}</p>
        )}
      </div>

      {/* Contraseña actual */}
      <div>
        <label className="block mb-1">Contraseña actual</label>
        <div className="relative">
          <input
            type={mostrarActual ? "text" : "password"}
            value={formData.passwordActual}
            onChange={(e) =>
              setFormData({ ...formData, passwordActual: e.target.value })
            }
            className={`w-full p-2 rounded-xl bg-fondo border ${
              errores.passwordActual ? "border-red-500" : "border-gray-600"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarActual(!mostrarActual)}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            {mostrarActual ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errores.passwordActual && (
          <p className="text-red-500 text-sm mt-1">
            {errores.passwordActual}
          </p>
        )}
      </div>

      {/* Nueva contraseña */}
      <div>
        <label className="block mb-1">Nueva contraseña (opcional)</label>
        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            value={formData.passwordNueva}
            onChange={(e) =>
              setFormData({ ...formData, passwordNueva: e.target.value })
            }
            className={`w-full p-2 rounded-xl bg-fondo border ${
              errores.passwordNueva ? "border-red-500" : "border-gray-600"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            {mostrarPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errores.passwordNueva && (
          <p className="text-red-500 text-sm mt-1">
            {errores.passwordNueva}
          </p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="block mb-1">Confirmar contraseña</label>
        <div className="relative">
          <input
            type={mostrarConfirmar ? "text" : "password"}
            value={formData.confirmarPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmarPassword: e.target.value })
            }
            className={`w-full p-2 rounded-xl bg-fondo border ${
              errores.confirmarPassword ? "border-red-500" : "border-gray-600"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            {mostrarConfirmar ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errores.confirmarPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errores.confirmarPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-azulUTN py-2 rounded-lg font-semibold hover:bg-blue-500 transition disabled:opacity-50"
      >
        {cargando ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
