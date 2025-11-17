import { useState, useEffect, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import { materiaService } from "../services/materiaService.js";
import { carreraService } from "../services/carreraService.js";
import { foroService } from "../services/foroService.js";

export default function EditarForo({ foroActual, onClose, onSave }) {

    const [archivos, setArchivos] = useState([]);
    const [archivosOriginales, setArchivosOriginales] = useState([]);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [erroresCampos, setErroresCampos] = useState({});
    const [, setMaterias] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [materiasFiltradas, setMateriasFiltradas] = useState([]);

    const userId = 1;

    const Limite_Individual_MB = 5;
    const Limite_Total_MB = 20;

    const textareaRef = useRef(null);

    const [formData, setFormData] = useState({
        carrera: "",
        materia: "",
        pregunta: "",
    });

    useEffect(() => {
        if (foroActual) {
        setFormData({
            carrera: foroActual.carrera || foroActual.materiaInfo?.carrera || "",
            materia: foroActual.materia || "",
            pregunta: foroActual.pregunta || "",
        });

        setArchivos(foroActual.archivos || []);
        setArchivosOriginales(foroActual.archivos || []);
        }
    }, [foroActual]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [carrerasBD, materiasBD] = await Promise.all([
                carreraService.obtenerTodos(),
                materiaService.obtenerTodos(),
                ]);

                setCarreras(carrerasBD);
                setMaterias(materiasBD);

                if (formData.carrera) {
                setMateriasFiltradas(
                    materiasBD.filter((m) => m.carrera === parseInt(formData.carrera))
                );
                } else {
                setMateriasFiltradas(materiasBD);
                }
            } catch (err) {
                console.error("Error al cargar datos:", err);
            }
        };

    cargar();
    }, [formData.carrera]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [formData.pregunta]);

    const handlerArchivoChange = (e) => {
        const nuevosArchivos = Array.from(e.target.files);
        let totalSize = archivos.reduce((acc, file) => acc + (file.size || 0), 0);
        let errores = [];

        for (const file of nuevosArchivos) {
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > Limite_Individual_MB) {
            errores.push(`❌ ${file.name} excede los ${Limite_Individual_MB}MB.`);
        }
        totalSize += file.size;
        }

        if (totalSize / (1024 * 1024) > Limite_Total_MB) {
        errores.push(`❌ El total no puede superar ${Limite_Total_MB}MB.`);
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
        const err = {};

        if (!formData.carrera) err.carrera = "Seleccioná una carrera.";
        if (!formData.materia) err.materia = "Seleccioná una materia.";
        if (!formData.pregunta.trim()) err.pregunta = "La pregunta no puede estar vacía.";

        setErroresCampos(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error) return alert("Resolvé los errores antes de guardar.");
        if (!validarFormulario()) return;

        setLoading(true);

        try {
            const archivosEliminados = archivosOriginales.filter(
                (a) => !archivos.some((nuevo) => nuevo.url === a.url)
            );

            const nuevosArchivos = archivos.filter((a) => a instanceof File);

            const formDataRequest = new FormData();
            formDataRequest.append("materia", parseInt(formData.materia));
            formDataRequest.append("pregunta", formData.pregunta);
            formDataRequest.append("usuario", userId);

            nuevosArchivos.forEach((file) => formDataRequest.append("archivos", file));
            formDataRequest.append("eliminados", JSON.stringify(archivosEliminados));

            await foroService.editar(foroActual.idForo, formDataRequest);

            onSave({
                ...foroActual,
                materia: parseInt(formData.materia),
                pregunta: formData.pregunta,
                archivos,
            });

            alert("✔ Foro actualizado correctamente");
            onClose();
        } catch (err) {
            console.error(err);
            alert("❌ Error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        alert("No se pudo identificar al usuario. Iniciá sesión nuevamente.");
        return;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 text-white w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-2">Editar Foro</h2>

        {/* CARRERA */}
        <div>
            <label>Carrera</label>
            <select
            value={formData.carrera}
            onChange={(e) => setFormData({ ...formData, carrera: Number(e.target.value) })}
            className={`w-full p-2 rounded-xl bg-fondo border ${
                erroresCampos.carrera ? "border-red-500" : "border-gray-600"
            }`}
            >
            <option value="">Seleccione...</option>
            {carreras.map((c) => (
                <option key={c.idCarrera} value={c.idCarrera}>{c.nombre}</option>
            ))}
            </select>
            {erroresCampos.carrera && <p className="text-red-500 text-sm">{erroresCampos.carrera}</p>}
        </div>

        {/* MATERIA */}
        <div>
            <label>Materia</label>
            <select
            value={formData.materia}
            onChange={(e) => setFormData({ ...formData, materia: Number(e.target.value) })}
            className={`w-full p-2 rounded-xl bg-fondo border ${
                erroresCampos.materia ? "border-red-500" : "border-gray-600"
            }`}
            >
            <option value="">Cargando lista...</option>
            {materiasFiltradas?.map((m) => (
                <option key={m.idMateria} value={m.idMateria}>{m.nombre}</option>
            ))}
            </select>
            {erroresCampos.materia && <p className="text-red-500 text-sm">{erroresCampos.materia}</p>}
        </div>

        {/* PREGUNTA */}
        <div>
            <label>Pregunta</label>
            <textarea
            ref={textareaRef}
            value={formData.pregunta}
            maxLength={1000}
            onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
            className={`w-full p-2 rounded-xl bg-fondo border ${
                erroresCampos.pregunta ? "border-red-500" : "border-gray-600"
            }`}
            />
            <p className="text-right text-gray-400">{formData.pregunta.length}/1000</p>
        </div>

        {/* ARCHIVOS */}
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
            <input id="file-upload" type="file" multiple onChange={handlerArchivoChange} className="hidden" />
            </label>

            {error && <p className="text-red-400 whitespace-pre-line text-sm mt-2">{error}</p>}

            {archivos.length > 0 && (
            <ul className="text-sm text-gray-300 mt-3 max-h-[65px] overflow-y-auto">
                {archivos.map((a, i) => {
                const isFile = a instanceof File;
                const nombreArchivo = isFile
                    ? a.name
                    : a.archivo_url
                    ? a.archivo_url.split("/").pop()
                    : "Archivo";
                const tamaño = isFile
                    ? `${(a.size / 1024 / 1024).toFixed(2)} MB`
                    : "Archivo existente";
                
                return(
                        <li key={i} className="flex items-center justify-between bg-gray-800 px-3 py-2 mb-2 rounded-lg">
                            
                            <div className="flex flex-col">
                                <span className="text-s">📎 {nombreArchivo}</span>
                                <span className="text-xs text-gray-400">{tamaño}</span>
                            </div>
                                
                            <button type="button" onClick={() => handleEliminarArchivo(i)} className="text-red-400 hover:text-red-600 transition">
                            <FiTrash2 size={18}/>
                            </button>
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