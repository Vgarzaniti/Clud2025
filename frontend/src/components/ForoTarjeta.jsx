import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "../input.css";

// Cambiar elementos de Respuesta para estar en relacion con el back
export default function ForoTarjeta({ foro }) {

  const [puntaje, setPuntaje] = useState(foro.puntaje || 0);
  const [voto, setVoto] = useState(null);

  const handleUpvote = () => {
    if (voto === "up") {
      // si vuelve a hacer click, quita el voto
      setPuntaje(puntaje - 1);
      setVoto(null);
    } else {
      // si cambia de voto negativo a positivo
      setPuntaje(voto === "down" ? puntaje + 2 : puntaje + 1);
      setVoto("up");
    }
  };

  const handleDownvote = () => {
    if (voto === "down") {
      setPuntaje(puntaje + 1);
      setVoto(null);
    } else {
      setPuntaje(voto === "up" ? puntaje - 2 : puntaje - 1);
      setVoto("down");
    }
  };
  
  return (
    <div className="bg-panel p-5 rounded-2xl shadow-md border border-gray-700 text-white">
      
      <h3 className="text-lg font-semibold">{foro.titulo}</h3>
      <p className="text-gray-300 mt-2">{foro.descripcion}</p>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-400">{foro.autor}</div>
        <div className="flex items-center gap-2">
          {/* Botón positivo */}
          <button
            onClick={handleUpvote}
            className={`p-2 rounded-lg border transition ${
              voto === "up"
                ? "bg-green-600 border-green-500"
                : "bg-fondo border-gray-500 hover:bg-gray-800"
            }`}
          >
            <ThumbsUp size={16} />
          </button>

          {/* Puntaje actual */}
          <span
            className={`text-sm font-semibold w-8 text-center ${
              puntaje > 0 ? "text-green-400" : puntaje < 0 ? "text-red-400" : "text-gray-300"
            }`}
          >
            {puntaje}
          </span>

          {/* Botón negativo */}
          <button
            onClick={handleDownvote}
            className={`p-2 rounded-lg border transition ${
              voto === "down"
                ? "bg-red-600 border-red-500"
                : "bg-fondo border-gray-500 hover:bg-gray-800"
            }`}
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

