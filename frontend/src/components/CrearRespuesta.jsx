import { useState } from "react";

export default function CrearRespuesta({ onClose }) {
  const [formData, setFormData] = useState({
    respuesta: "",
    archivo: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nueva respuesta:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <h2 className="text-xl font-semibold text-center mb-2">Crear Respuesta</h2>

      <div>
        <label className="block text-sm mb-1">Respuesta</label>
        <textarea
          rows="4"
          value={formData.respuesta}
          onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
          className="w-full p-2 rounded-lg bg-fondo border border-gray-600 focus:outline-none min-h-[100px] max-h-[320px]"
          placeholder="Escribí tu respuesta..."
        ></textarea>
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
        Responder
      </button>
    </form>
  );
}
