import BarraLado from "../components/BarraLado.jsx";
import ForoTarjeta from "../components/ForoTarjeta.jsx";
import "../input.css";

export default function Inicio() {
  const respuesta = [
    {
      id: 1,
      titulo: "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizo",
      descripcion: "Ejemplo de respuesta con archivo y usuario asociado",
      autor: "Juan Pérez",
      respuestas: 5,
    },
    {
      id: 2,
      titulo: "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizo",
      descripcion: "Ejemplo de otra publicación con datos y archivo adjunto",
      autor: "Ana Gómez",
      respuestas: 3,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-6 flex gap-6">
      <BarraLado />
      <main className="flex-1 space-y-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar Foro"
            className="bg-panel border border-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg flex-1"
          />
          <button className="bg-azulUTN text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Publicar
          </button>
        </div>

        {respuesta.map((foro) => (
          <ForoTarjeta key={foro.id} foro={foro} />
        ))}
      </main>
    </div>
  );

}