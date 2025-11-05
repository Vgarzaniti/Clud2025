import { useState } from "react";
import { useRef, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function EditarRespuesta({ respuestaActual, onClose, onSave }) {
    
    const [archivos, setArchivos] = useState(
        Array.isArray(respuestaActual.archivos)
            ? respuestaActual.archivos
            : respuestaActual.archivos
            ? [respuestaActual.archivos] // lo mete en array si era string
            : []
    );
    const [error, setError] = useState(null);
    const [erroresCampos, setErroresCampos] = useState({});

    const Limite_Individual_MB = 5;
    const Limite_Total_MB = 20;

  const textareaRef = useRef(null);
    
    const [formData, setFormData] = useState({
        respuesta: respuestaActual.respuesta || "",
    });

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [formData.respuesta]);

    const hadleArchivoChange = (e) => {
        const nuevosArchivos = Array.from(e.target.files);
        let totalSize = archivos.reduce((acc, file) => acc + file.size, 0);
        let errores = [];

        for (const file of nuevosArchivos) {
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > Limite_Individual_MB) {
            errores.push(`❌ ${file.name} excede el límite de ${Limite_Individual_MB}MB.`);
        }
        totalSize += file.size;
        }

        if (totalSize / (1024 * 1024) > Limite_Total_MB) {
        errores.push(`❌ El tamaño total de archivos no puede superar ${Limite_Total_MB}MB.`);
        }

        if (errores.length > 0) {
        setError(errores.join("\n"));
        } else {
        setError("");
        setArchivos((prev) => [...prev, ...nuevosArchivos]);
        }
    };

    const handleEliminarArchivo = (index) => {
        const nuevos = archivos.filter((_, i) => i !== index);
        setArchivos(nuevos);
    }

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.respuesta.trim()) nuevosErrores.respuesta = "La respuesta no puede estar vacía.";

        setErroresCampos(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) {
            alert("Corrige los errores antes de publicar.");
            return;
        }

        if (!validarFormulario()) {
            return;
        }

        onSave({
            ...respuestaActual,
            respuesta: formData.respuesta,
            archivos,
        });

        console.log("Archivos válidos:", archivos);
        alert("Respuesta publicada correctamente.");
        onClose();
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-5 text-white w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-2">Editar Respuesta</h2>

            <div>
                <label className="block text-sm mb-1">Respuesta</label>
                <textarea
                    ref={textareaRef}
                    value={formData.respuesta}
                    onChange={(e) => {
                        const limiteCaracteres = e.target.value;
                        if (limiteCaracteres.length <= 3000){
                        setFormData({ ...formData, respuesta: e.target.value })
                        }
                    }}
                    maxLength={3000}
                    className={`w-full p-2 rounded-xl bg-fondo border ${
                        erroresCampos.respuesta ? "border-red-500" : "border-gray-600"
                    } focus:outline-none overflow-y-auto min-h-[100px] max-h-[250px]`}
                    placeholder="Escribí tu respuesta..."
                />
                {erroresCampos.respuesta && (
                    <p className="text-red-500 text-sm mt-1">{erroresCampos.respuesta}</p>
                )}
                <p className={`text-right mr-1 ${formData.respuesta.length >= 3000 ? "text-red-500" : "text-gray-400"}`}>
                    {formData.respuesta.length} / 3000
                </p>
            </div>

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
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={hadleArchivoChange}
                    className="hidden"
                />
                </label>

                {error && (
                    <p className="text-red-400 whitespace-pre-line text-sm mt-2">{error}</p>
                )}

                {Array.isArray(archivos) && archivos.length > 0 && (
                    <ul className="text-sm text-gray-300 mt-3 max-h-[65px] overflow-y-auto">
                        {archivos.map((a, i) => {
                            // Detectar si es un objeto File o un string (nombre o URL)
                            const isFileObject = a instanceof File;
                            const nombreArchivo = isFileObject ? a.name : a.split("/").pop(); // extrae nombre del path o URL
                            const tamaño = isFileObject
                                ? `${(a.size / 1024 / 1024).toFixed(2)} MB`
                                : "Archivo existente";

                            return (
                                <li
                                    key={i}
                                    className="flex items-center justify-between bg-gray-800 px-3 py-2 mb-2 rounded-lg"
                                >
                                <div className="flex flex-col">
                                    <span className="text-s">📎 {nombreArchivo}</span>
                                    <span className="text-xs text-gray-400">{tamaño}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleEliminarArchivo(i)}
                                    className="text-red-400 hover:text-red-600 transition"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
                Guardar cambios
            </button>
        </form>
    );
}