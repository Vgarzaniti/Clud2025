import { useState } from "react";

export default function EditarUsuario({ usuarioActual, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: usuarioActual.nombre || "",
    username: usuarioActual.username || "",
    email: usuarioActual.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre no puede estar vacío.";
    if (!formData.username.trim()) nuevosErrores.username = "El nombre de usuario es obligatorio.";
    if (!formData.email.trim()) nuevosErrores.email = "El correo electrónico es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = "Correo electrónico inválido.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) return;
    
    setLoading(true);

    onSave(formData);
    alert("Perfil actualizado correctamente.");
    onClose();
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10 text-white w-full max-w-md"
    >
      <h2 className="text-xl font-semibold text-center mb-2">Editar Perfil</h2>

      <div>
        <label className="block text-m mb-1">Nombre Completo</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            errores.nombre ? "border-red-500" : "border-gray-600"
          } focus:outline-none`}
        />
        {errores.nombre && (
          <p className="text-red-500 text-m mt-1">{errores.nombre}</p>
        )}
      </div>

      <div>
        <label className="block text-m mb-1">Nombre de Usuario</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            errores.username ? "border-red-500" : "border-gray-600"
          } focus:outline-none`}
        />
        {errores.username && (
          <p className="text-red-500 text-m mt-1">{errores.username}</p>
        )}
      </div>

      <div>
        <label className="block text-m mb-1">Correo Electrónico</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            errores.email ? "border-red-500" : "border-gray-600"
          } focus:outline-none`}
        />
        {errores.email && (
          <p className="text-red-500 text-m mt-1">{errores.email}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-azulUTN py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
