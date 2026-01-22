import { useState, useRef, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { respuestaService } from "../services/respuestaService.js";

export default function EditarRespuesta({ respuestaActual, onClose, onSave }) {
  
  const [archivosExistentes, setArchivosExistentes] = useState(respuestaActual.archivos || []);
  const [archivosNuevos, setArchivosNuevos] = useState([]);
  const [archivosAEliminar, setArchivosAEliminar] = useState([]);

  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  
  const [formData, setFormData] = useState({
    respuesta: respuestaActual.respuesta_texto || "",
  });
  const [cargando, setCargando] = useState(false);
  const fileInputRef = useRef(null);

  const textareaRef = useRef(null);
  const LIMITE_INDIVIDUAL_MB = 5;
  const LIMITE_TOTAL_MB = 20;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [formData.respuesta]);

  const handleArchivoChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    let totalSize = archivosExistentes.reduce((acc, file) => acc + file.size, 0);
    let errores = [];

    for (const file of nuevosArchivos) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > LIMITE_INDIVIDUAL_MB) {
        errores.push(`❌ ${file.name} excede el límite de ${LIMITE_INDIVIDUAL_MB}MB.`);
      }
      totalSize += file.size;
    }

    if (totalSize / (1024 * 1024) > LIMITE_TOTAL_MB) {
      errores.push(`❌ El tamaño total de archivos no puede superar ${LIMITE_TOTAL_MB}MB.`);
    }

    if (errores.length > 0) {
      setError(errores.join("\n"));
    } else {
      setError("");
      setArchivosNuevos((prev) => [...prev, ...nuevosArchivos]);
      setArchivosExistentes((prev) => [...prev, ...nuevosArchivos]);
      fileInputRef.current.value = "";
    }
  };

  const handleEliminarArchivo = (archivo,index) => {
    
    // Si viene del backend (tiene id)
    if (archivo.id) {
      setArchivosAEliminar((prev) =>
        prev.includes(archivo.id) ? prev : [...prev, archivo.id]
      );
    }

    setArchivosExistentes((prev) => prev.filter((_, i) => i !== index));

    // Si era nuevo, también sacarlo
    setArchivosNuevos((prev) =>
      prev.filter((a) => a !== archivo)
    );
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.respuesta.trim()) nuevosErrores.respuesta = "La respuesta no puede estar vacía.";
    
    setErroresCampos(nuevosErrores);
    
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cargando) return;

    if (error) {
      alert("Corrige los errores antes de guardar.");
      return;
    }

    if (!validarFormulario()) return;

    setCargando(true);

    try {
      const formDataAPI = new FormData();

      formDataAPI.append("respuesta_texto", formData.respuesta.trim());
      formDataAPI.append("usuario", respuestaActual.usuario);
      formDataAPI.append("foro", respuestaActual.foro);
      formDataAPI.append("materia", respuestaActual.materia);

      // Adjuntar solo los archivos nuevos (File)
      archivosNuevos.forEach((archivo) => {
        formDataAPI.append("archivos", archivo);
      });

      if (archivosAEliminar.length > 0) {
        formDataAPI.append(
          "archivos_a_eliminar",
          archivosAEliminar.join(",")
        );
      }

      const respuestaEditada = await respuestaService.editar(
        respuestaActual.idRespuesta,
        formDataAPI
      );

      alert("✅ Respuesta actualizada correctamente.");
      onSave(respuestaEditada);
      onClose();

    } catch (err) {

      console.error("❌ Error al editar respuesta:", err);
      alert("Ocurrió un error al guardar los cambios.");
    
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white w-full max-w-md">
      <h2 className="text-xl font-semibold text-center mb-2">Editar Respuesta</h2>

      {/* Texto de respuesta */}
      <div>
        <label className="block text-sm mb-1">Respuesta</label>
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
          placeholder="Editá tu respuesta..."
        />
        {erroresCampos.respuesta && (
          <p className="text-red-500 text-sm mt-1">{erroresCampos.respuesta}</p>
        )}
        <p
          className={`text-right mr-1 ${
            formData.respuesta.length >= 3000 ? "text-red-500" : "text-gray-400"
          }`}
        >
          {formData.respuesta.length} / 3000
        </p>
      </div>

      {/* Archivos */}
      <div className="w-full">
        <label className="block text-m mb-2">Archivos adjuntos</label>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full p-2 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
        >
          <p className="text-gray-300 font-medium">
            Arrastrá tus archivos o <span className="text-azulUTN">seleccionalos</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Máx. 5MB por archivo — 20MB total
          </p>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            onChange={handleArchivoChange}
            className="hidden"
          />
        </label>

        {error && (
          <p className="text-red-400 whitespace-pre-line text-sm mt-2">{error}</p>
        )}
          
        <div className="max-h-40 overflow-y-auto pr-1 mt-2">
                    
          {archivosExistentes.map((a, i) => {

            return (
              <li key={i} className="flex justify-between bg-gray-800 px-3 py-2 mb-2 mt-2 rounded-lg">
                <div className="flex flex-col">
                  <span>📎 {a.name || a.archivo_url?.split("/").pop()}</span>
                  {a.size && (
                    <span className="text-xs text-gray-400">
                      {(a.size / 1024 / 1024).toFixed(2)} MB
                   </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleEliminarArchivo(a, i)}
                  className="text-red-400 hover:text-red-600"
                >
                  <FiTrash2 size={18}/>
                </button>
              </li>
            );
          })}      
        </div>
      </div>

      <button
        type="submit"
        disabled={cargando}
        className={`w-full py-2 rounded-lg font-semibold transition
        ${
          cargando
          ? "bg-gray-500 cursor-not-allowed opacity-70"
          : "bg-azulUTN hover:bg-blue-500"
        }`}
      >
        { cargando ? "Guardando cambios..." : "Guardar cambios"}
      </button>
    </form>
  );
}
