import { useState, useRef, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { respuestaService } from "../services/respuestaService";
import { useAuth } from "../context/useAuth.js";

export default function CrearRespuesta({ foroId, onClose, onSave }) {
  const { usuario } = useAuth();
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [formData, setFormData] = useState({ respuesta: "" });
  const textareaRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const userId = usuario.idUsuario;

  const Limite_Individual_MB = 5;
  const Limite_Total_MB = 20;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [formData.respuesta]);

  const handleArchivoChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    let totalSize = archivos.reduce((acc, file) => acc + file.size, 0);
    let errores = [];

    for (const file of nuevosArchivos) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > Limite_Individual_MB) {
        errores.push(
          `❌ ${file.name} excede el límite de ${Limite_Individual_MB}MB.`
        );
      }
      totalSize += file.size;
    }

    if (totalSize / (1024 * 1024) > Limite_Total_MB) {
      errores.push(
        `❌ El tamaño total de archivos no puede superar ${Limite_Total_MB}MB.`
      );
    }

    if (errores.length > 0) {
      setError(errores.join("\n"));
    } else {
      setError("");
      setArchivos((prev) => [...prev, ...nuevosArchivos]);
    }
  };

  const handleEliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.respuesta.trim()) {
      nuevosErrores.respuesta = "La respuesta no puede estar vacía.";
    }
    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cargando) return;

    if (error) {
      alert("Corrige los errores antes de publicar.");
      return;
    }

    if (!validarFormulario()) return;

    setCargando(true);

    try {
      const formDataAPI = new FormData();
      formDataAPI.append("usuario", userId);
      formDataAPI.append("foro", foroId);
      formDataAPI.append("respuesta_texto", formData.respuesta);

      archivos.forEach((archivo) => {
        formDataAPI.append("archivos", archivo);
      });

      const respuestaGuardada = await respuestaService.crear(formDataAPI);

      onSave(respuestaGuardada);
      alert("✅ Respuesta publicada correctamente.");
      onClose();
    } catch (err) {
      console.error("❌ Error al crear la respuesta:", err);
      alert("Ocurrió un error al publicar la respuesta.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white w-full max-w-md">
      <h2 className="text-xl font-semibold text-center mb-2">
        Crear Respuesta
      </h2>

      <div>
        <label className="block text-m mb-1">Respuesta</label>
        <textarea
          ref={textareaRef}
          value={formData.respuesta}
          onChange={(e) =>
            e.target.value.length <= 3000 &&
            setFormData({ ...formData, respuesta: e.target.value })
          }
          maxLength={3000}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            erroresCampos.respuesta ? "border-red-500" : "border-gray-600"
          } focus:outline-none overflow-y-auto min-h-[100px] max-h-[250px]`}
          placeholder="Escribí tu respuesta..."
        />
        {erroresCampos.respuesta && (
          <p className="text-red-500 text-sm mt-1">
            {erroresCampos.respuesta}
          </p>
        )}
        <p
          className={`text-right mr-1 ${
            formData.respuesta.length >= 3000
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {formData.respuesta.length} / 3000
        </p>
      </div>

      {/* Archivos */}
      <div className="w-full">
        <label className="block text-m mb-2">Archivos adjuntos (.jpng/.png/.pdf/.word)</label>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full p-2 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
        >
          <p className="text-gray-300 font-medium">
            Arrastrá tus archivos o{" "}
            <span className="text-azulUTN">seleccionalos</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Máx. 5MB por archivo — 20MB total
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleArchivoChange}
            className="hidden"
          />
        </label>

        {error && (
          <p className="text-red-400 whitespace-pre-line text-sm mt-2">
            {error}
          </p>
        )}

        {archivos.length > 0 && (
          <ul className="text-sm text-gray-300 mt-3 max-h-[65px] overflow-y-auto">
            {archivos.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-gray-800 px-3 py-2 mb-2 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-s">📎 {a.name}</span>
                  <span className="text-xs text-gray-400">
                    {(a.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEliminarArchivo(i)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={cargando}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          cargando
            ? "bg-gray-500 cursor-not-allowed opacity-70"
            : "bg-azulUTN hover:bg-blue-500"
        }`}
      >
        {cargando ? "Respondiendo..." : "Responder"}
      </button>
    </form>
  );
}
