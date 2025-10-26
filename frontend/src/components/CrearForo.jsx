import { useState } from "react";
import { useRef, useEffect } from "react";

export default function CrearForo({ onClose, defaultCarrera = "", defaultMateria = "" }) {
  const textareaRef = useRef(null);
  const [formData, setFormData] = useState({
    carrera: defaultCarrera,
    materia: defaultMateria,
    pregunta: "",
    archivo: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nuevo foro creado:", formData);
    onClose();
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [formData.pregunta]);

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-white w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-2">Crear Foro</h2>

      <div>
        <label className="block text-m mb-1">Carrera</label>
        <select
          value={formData.carrera}
          onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
          className="w-full p-2 rounded-xl bg-fondo border border-gray-600 focus:outline-none cursor-pointer"
        >
            <option value="">Seleccionar carrera</option>
            <option>Industrial</option>
            <option>Mecanica</option>
            <option>Sistemas</option>
            <option>Electrica</option>
            <option>Quimica</option>
        </select>
      </div>

      <div>
        <label className="block text-m mb-1">Materia</label>
        <select
          value={formData.materia}
          onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
          className="w-full p-2 rounded-xl bg-fondo border border-gray-600 focus:outline-none cursor-pointer"
        >
          <option value="">Seleccionar materia</option>
          <option>Programacion 1</option>
          <option>Programacion 2</option>
          <option>Redes De Datos</option>
          <option>Base De Datos</option>
          <option>Sistemas Operativos</option>
          <option>Ingenieria De Software</option>
          <option>Fisica 1</option>
          <option>Circuitos</option>
          <option>Microcontroladores</option>
          <option>Electronica Digital</option>
          <option>Automatizacion</option>
          <option>Control De Sistemas</option>

        </select>
      </div>

      <div>
        <label className="block text-m mb-1">Pregunta</label>
        <textarea
          ref={textareaRef}
          value={formData.pregunta}
          onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
          className="w-full p-2 rounded-xl bg-fondo border border-gray-600 focus:outline-none overflow-y-auto min-h-[50px] max-h-[90px]"
          placeholder="Escribí tu pregunta aquí..."
        />
      </div>

      <div className="w-full max-w-md">
        <label className="block text-m mb-1">Archivo</label>
        <label 
          htmlFor="archivo"
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-azulUTN text-white cursor-pointer hover:bg-blue-500 transition ${
            formData.archivo
              ? "bg-green-600 hover:bg-green-700"
              : "bg-cyan-900 hover:bg-blue-500"
          } text-white`}
        >
          {formData.archivo ? "Archivo cargado" : "Seleccionar archivo"}
        </label>          
        
        <input
          id="archivo"
          type="file"
          onChange={(e) => setFormData({ ...formData, archivo: e.target.files[0] })}
          className="hidden"
        />

        {formData.archivo && (
          <p className="mt-2 text-sm text-gray-400 truncate">
            Archivo seleccionado: <span className="font-medium">{formData.archivo.name}</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-azulUTN py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
      >
        Publicar
      </button>
    </form>
  );
}