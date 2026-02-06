import { useState, useEffect, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import { foroService } from "../services/foroService.js";
import { materiaService } from "../services/materiaService.js";
import { carreraService } from "../services/carreraService.js";
import { useAuth } from "../context/useAuth.js";

export default function CrearForo({ onClose, onForoCreado }) {
  const { usuario } = useAuth();
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const Limite_Individual_MB = 5;
  const Limite_Total_MB = 20;

  const extensionesPermitidas = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];

  const textareaRef = useRef(null);
  const [formData, setFormData] = useState({
    carrera: "",
    materia: "",
    pregunta: "",
  });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [formData.pregunta]);

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
    if (!formData.carrera) {
      setMateriasFiltradas(materias);
    } else {
      setMateriasFiltradas(
        materias.filter(m => m.carrera === parseInt(formData.carrera))
      );
    }
  }, [formData.carrera, materias]);


  const handleArchivoChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    let totalSize = archivos.reduce((acc, file) => acc + file.size, 0);
    let errores = [];

    for (const file of nuevosArchivos) {

      const extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      
      const sizeMB = file.size / (1024 * 1024);
      
      if (sizeMB > Limite_Individual_MB) {
        errores.push(`❌ ${file.name} excede el límite de ${Limite_Individual_MB}MB.`);
      }

      totalSize += file.size;

      if (!extensionesPermitidas.includes(extension)) {
        errores.push(`❌ ${file.name} no es un tipo permitido`);
      }

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

    if (cargando) return;
    if (error) {
      alert("Corrige los errores antes de publicar.");
      return;
    }
    if (!validarFormulario()) return;

    setCargando(true);

    try {
      const data = new FormData();
      data.append("usuario", usuario.idUsuario);
      data.append("materia", parseInt(formData.materia));
      data.append("pregunta", formData.pregunta);

      archivos.forEach((archivo) => {
        data.append("archivos", archivo);
      });

      const foroCreado = await foroService.crear(data);

      alert("✅ Foro publicado correctamente.");
      onForoCreado(foroCreado);
      onClose();
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Response data:", error.response?.data);
      
      // Mejor manejo del error
      let errorMsg = error.message;
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.usuario) {
          errorMsg = `Usuario error: ${JSON.stringify(error.response.data.usuario)}`;
        } else {
          errorMsg = JSON.stringify(error.response.data, null, 2);
        }
      }
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-2">Crear Foro</h2>

      {/* Carrera */}
      <div>
        <label className="block text-m mb-1">Carrera</label>
        <select
          value={formData.carrera}
          onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
          className={`w-full p-2 rounded-xl bg-fondo border ${
            erroresCampos.carrera ? "border-red-500" : "border-gray-600"
          } focus:outline-none cursor-pointer`}
        >
          <option value="">Seleccionar carrera</option>
          {carreras.map((c) => (
            <option key={c.idCarrera} value={c.idCarrera}>
              {c.nombre}
            </option>
          ))}
        </select>
        {erroresCampos.carrera && (
          <p className="text-red-500 text-sm mt-1">{erroresCampos.carrera}</p>
        )}
      </div>

      {/* Materia */}
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
        <label className="block text-m mb-2">Archivos adjuntos (.jpg/.pdf/.word)</label>

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
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
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

      {/* Botón */}
      <button
        type="submit"
        disabled={cargando}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          cargando
            ? "bg-gray-500 cursor-not-allowed opacity-70"
            : "bg-azulUTN hover:bg-blue-500"
        }`}
      >
        {cargando ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
