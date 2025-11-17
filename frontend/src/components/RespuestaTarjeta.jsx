import { useState } from "react";
import { ThumbsUp, ThumbsDown, Paperclip } from "lucide-react";

export default function RespuestaTarjeta({ respuesta }) {
  const textoRespuesta = respuesta.respuesta_texto || respuesta.respuesta || respuesta.contenido || "";

  const totalPuntaje = Array.isArray(respuesta.puntajes)
    ? respuesta.puntajes.reduce((acc, p) => acc + p.valor, 0)
    : 0;

  const userId = 1; // luego vendrá de auth

  const votoPrevio = respuesta.puntajes?.find(p => p.usuario === userId);

  const [puntaje, setPuntaje] = useState(totalPuntaje);
  const [voto, setVoto] = useState(votoPrevio ? (votoPrevio.valor > 0 ? "up" : "down") : null);
  const [expandido, setExpandido] = useState(false);

  const limite = 300;

  const textoCorto =
    textoRespuesta.length > limite ? textoRespuesta.slice(0, limite) + "..." : textoRespuesta;

  const handleVote = async (tipo) => {
    let nuevoValor = 0;

    if (!voto) {
      nuevoValor = tipo === "up" ? 1 : -1;
    } else if (voto === tipo) {
      nuevoValor = 0;
    } else {
      nuevoValor = tipo === "up" ? 1 : -1;
    }

    try {
      await fetch(`/api/puntaje/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: userId,
          valor: nuevoValor,
          respuesta: respuesta.idRespuesta,
        }),
      });

      // Actualiza estado local
      setPuntaje(prev => prev + (nuevoValor - (voto === "up" ? 1 : voto === "down" ? -1 : 0)));
      setVoto(nuevoValor === 0 ? null : tipo);

    } catch (error) {
      console.error("Error al votar:", error);
    }
  };

  return (
    <div className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md">
      <p className="text-gray-200 whitespace-pre-line">
        {expandido ? textoRespuesta : textoCorto}
      </p>

      {textoRespuesta.length > limite && (
        <button onClick={() => setExpandido(!expandido)} className="mt-1 text-gray-500 hover:underline text-sm">
          {expandido ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}

      {/* Archivos */}
      {Array.isArray(respuesta.archivos) && respuesta.archivos.length > 0 && (
        <div className="mt-4 space-y-3">
          {respuesta.archivos.map((archivo, i) => {
            const enlace = archivo.archivo_url || archivo.archivo;
            const nombreArchivo = archivo.nombre || enlace.split("/").pop();
            return (
              <div key={archivo.id || i} className="flex items-center gap-2 text-blue-400">
                <Paperclip size={16} />
                <a href={enlace} download={nombreArchivo} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500 truncate max-w-[150px]">
                  {nombreArchivo}
                </a>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">Respuesta de {respuesta.autor || "Anonimo"}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("up")}
            className={`p-2 rounded-lg border transition ${voto === "up" ? "bg-green-600 border-green-500" : "bg-fondo border-gray-500 hover:bg-gray-800"}`}
          >
            <ThumbsUp size={16} />
          </button>

          <span className={`text-sm font-semibold w-8 text-center ${
            puntaje > 0 ? "text-green-400" : puntaje < 0 ? "text-red-400" : "text-gray-300"
          }`}>
            {puntaje}
          </span>

          <button
            onClick={() => handleVote("down")}
            className={`p-2 rounded-lg border transition ${voto === "down" ? "bg-red-600 border-red-500" : "bg-fondo border-gray-500 hover:bg-gray-800"}`}
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
