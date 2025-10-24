import { useState } from "react";
import { ThumbsUp, ThumbsDown, Paperclip } from "lucide-react";

export default function RespuestaTarjeta({ respuesta }) {
    const [puntaje, setPuntaje] = useState(respuesta.puntaje || 0);
    const [voto, setVoto] = useState(null);

    const handleUpvote = () => {
        if (voto === "up") {
            setPuntaje(puntaje - 1);
            setVoto(null);
        }else {
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
    <div className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md">
      <p className="text-gray-200">{respuesta.respuesta}</p>

      {respuesta.archivo && (
        <div className="flex items-center gap-2 mt-2 text-sm text-blue-400 cursor-pointer hover:underline">
          <Paperclip size={16} />
          <span>{respuesta.archivo}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">Respuesta de {respuesta.autor}</span>
        <div className="flex items-center gap-2">
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

          <span
            className={`text-sm font-semibold w-8 text-center ${
              puntaje > 0
                ? "text-green-400"
                : puntaje < 0
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {puntaje}
          </span>

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