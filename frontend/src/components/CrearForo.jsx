import { useState, useEffect, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import { foroService } from "../services/foroService.js";
import { materiaService } from "../services/materiaService.js";
import { carreraService } from "../services/carreraService.js";

export default function CrearForo({ onClose }) {
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);

  const Limite_Individual_MB = 5;
  const Limite_Total_MB = 20;

  const textareaRef = useRef(null);
  const [formData, setFormData] = useState({
    carrera: "",
    materia: "",
    pregunta: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [carrerasBD, materiasBD] = await Promise.all([
          carreraService.obtenerTodos(),
          materiaService.obtenerTodos(),
        ]);
        setCarreras(carrerasBD);
        setMaterias(materiasBD);
        setMateriasFiltradas(materiasBD); 
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [formData.pregunta]);

  useEffect(() => {
    if (formData.carrera) {
      const filtradas = materias.filter(
        (m) => m.carrera === parseInt(formData.carrera)
      );
      setMateriasFiltradas(filtradas);
    } else {
      setMateriasFiltradas(materias); // si no hay carrera, mostrar todas
    }
    
    setFormData((prev) => ({ ...prev, materia: "" }));
  }, [formData.carrera, materias]);

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
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.carrera) nuevosErrores.carrera = "Debes seleccionar una carrera.";
    if (!formData.materia) nuevosErrores.materia = "Debes seleccionar una materia.";
    if (!formData.pregunta.trim()) nuevosErrores.pregunta = "La pregunta no puede estar vacía.";

    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      alert("Corrige los errores antes de publicar.");
      return;
    }

    if (!validarFormulario()) return;

    try {
      const nuevoForo = {
        usuario: 1, 
        materia: parseInt(formData.materia),
        pregunta: formData.pregunta,
      };

      await foroService.crear(nuevoForo);

      alert("✅ Foro publicado correctamente.");
      onClose();
    } catch (error) {
      console.error("❌ Error al publicar el foro:", error);
      alert("Hubo un error al publicar el foro. Verifica la consola.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-2">Crear Foro</h2>

      {/* Selección de carrera */}
      <div>
        <label className="block text-m mb-1">Carrera</label>
        <select
          value={formData.carrera}
          onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            erroresCampos.carrera ? "border-red-500" : "border-gray-600"
          } focus:outline-none cursor-pointer`}
        >
          <option value="">Todas las carreras</option>
          {carreras.map((c) => (
            <option key={c.idCarrera} value={c.idCarrera}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de materia */}
      <div>
        <label className="block text-m mb-1">Materia</label>
        <select
          value={formData.materia}
          onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            erroresCampos.materia ? "border-red-500" : "border-gray-600"
          } focus:outline-none cursor-pointer`}
        >
          <option value="">Seleccionar materia</option>
          {materiasFiltradas.map((m) => (
            <option key={m.idMateria} value={m.idMateria}>
              {m.nombre}
            </option>
          ))}
        </select>
        {erroresCampos.materia && (
          <p className="text-red-500 text-sm mt-1">{erroresCampos.materia}</p>
        )}
      </div>

      {/* Pregunta */}
      <div>
        <label className="block text-m mb-1">Pregunta</label>
        <textarea
          ref={textareaRef}
          value={formData.pregunta}
          onChange={(e) => {
            if (e.target.value.length <= 1000) {
              setFormData({ ...formData, pregunta: e.target.value });
            }
          }}
          maxLength={1000}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            erroresCampos.pregunta ? "border-red-500" : "border-gray-600"
          } focus:outline-none overflow-y-auto min-h-[50px] max-h-[90px]`}
          placeholder="Escribí tu pregunta aquí..."
        />
        {erroresCampos.pregunta && (
          <p className="text-red-500 text-sm mt-1">{erroresCampos.pregunta}</p>
        )}
        <p
          className={`text-right mr-1 ${
            formData.pregunta.length >= 1000 ? "text-red-500" : "text-gray-400"
          }`}
        >
          {formData.pregunta.length} / 1000
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
            onChange={hadleArchivoChange}
            className="hidden"
          />
        </label>

        {error && (
          <p className="text-red-400 whitespace-pre-line text-sm mt-2">{error}</p>
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

      {/* Botón final */}
      <button
        type="submit"
        className="w-full bg-azulUTN py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
      >
        Publicar
      </button>
    </form>
  );
}
