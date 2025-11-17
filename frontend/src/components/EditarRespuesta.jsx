import { useState, useRef, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { respuestaService } from "../services/respuestaService.js";

export default function EditarRespuesta({ respuestaActual, onClose, onSave }) {
  const [archivos, setArchivos] = useState([]);
  const [archivosOriginales, setArchivosOriginales] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [formData, setFormData] = useState({
    respuesta: respuestaActual.respuesta_texto || "",
  });

  const userId = 1;

  const textareaRef = useRef(null);
  const LIMITE_INDIVIDUAL_MB = 5;
  const LIMITE_TOTAL_MB = 20;

  useEffect(() => {
    if (respuestaActual?.archivos) {
      setArchivos(respuestaActual.archivos);          
      setArchivosOriginales(respuestaActual.archivos); 
    }
  }, [respuestaActual]);



  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [formData.respuesta]);

  const handleArchivoChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    let totalSize = archivos
      .filter((a) => a instanceof File)
      .reduce((acc, file) => acc + file.size, 0);

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
      setArchivos((prev) => [...prev, ...nuevosArchivos]);
    }
  };

  const handleEliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.respuesta.trim()) nuevosErrores.respuesta = "La respuesta no puede estar vacía.";
    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) return alert("Corrige los errores antes de guardar.");
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const formDataAPI = new FormData();

      formDataAPI.append("respuesta_texto", formData.respuesta);
      formDataAPI.append("usuario", userId);
      formDataAPI.append("foro", respuestaActual.foro);
      formDataAPI.append("materia", respuestaActual.materia);

      const sanitizarArchivo = (file) => {
        const nombreSeguro = file.name.replace(/[^\w.-]+/g, "_");
        return new File([file], nombreSeguro, { type: file.type });
      };

      const nuevosArchivos = archivos.filter(a => a instanceof File);
      nuevosArchivos.forEach(file => formDataAPI.append("archivos[]", sanitizarArchivo(file)));

      const archivosPersistentes = archivos
        .filter(a => !(a instanceof File))
        .map(a => a.archivo_url);

      formDataAPI.append("persistentes", JSON.stringify(archivosPersistentes));

      const archivosEliminados = archivosOriginales.filter(
        (orig) => !archivosPersistentes.includes(orig.archivo_url)
      );

      formDataAPI.append("eliminados", JSON.stringify(archivosEliminados));

      for (const pair of formDataAPI.entries()) {
        console.log("FORM DATA →", pair[0], pair[1]);
      }

      const respuestaEditada = await respuestaService.editar(
        respuestaActual.idRespuesta,
        formDataAPI
      );

      console.log("Archivos enviados:", archivos);
      console.log("Nuevos:", nuevosArchivos);
      console.log("Persisten:", archivosPersistentes);
      console.log("Eliminados:", archivosEliminados);

      alert("✔ Respuesta actualizada correctamente.");
      onSave(respuestaEditada);
      onClose();

    } catch (err) {
      console.error("❌ Error al editar respuesta:", err);
      alert("Ocurrió un error al guardar los cambios.");
    } finally {
      setLoading(false);
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

        <div
          className="flex flex-col items-center justify-center w-full p-3 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-300 font-medium">
            Arrastrá archivos o <span className="text-azulUTN underline">seleccionalos</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Máx. 5MB por archivo — 20MB total</p>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleArchivoChange}
          />
        </div>

        {error && (
          <p className="text-red-400 whitespace-pre-line text-sm mt-2">{error}</p>
        )}

        {archivos.length > 0 && (
          <ul className="text-sm text-gray-300 mt-3 max-h-[100px] overflow-y-auto">
            {archivos.map((a, i) => {
              const isFile = a instanceof File;
              const nombreArchivo = isFile
                ? a.name
                : a.archivo_url.split("/").pop();
              const tamaño = isFile
                ? `${(a.size / 1024 / 1024).toFixed(2)} MB`
                : "Archivo guardado";

              return (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-800 px-3 py-2 mb-2 rounded-lg"
                >
                  <div>
                    <span>📎 {nombreArchivo}</span>
                    <p className="text-xs text-gray-500">{tamaño}</p>
                  </div>

                  {(isFile || !isFile) && (
                    <button
                      type="button"
                      onClick={() => handleEliminarArchivo(i)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>


      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
