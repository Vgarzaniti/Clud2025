import { useState } from "react";
import { ThumbsUp, ThumbsDown, Paperclip } from "lucide-react";

export default function RespuestaTarjeta({ respuesta }) {
    const textoRespuesta = respuesta.respuesta_texto || respuesta.respuesta || respuesta.contenido || "";
    const [puntaje, setPuntaje] = useState(respuesta.puntaje || 0);
    const [voto, setVoto] = useState(null);
    const [expandido, setExpandido] = useState(false);
    const limite = 300;

    const textoCorto =
      textoRespuesta.length > limite
        ? textoRespuesta.slice(0, limite) + "..."
        : textoRespuesta;
    
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
      
      <p className="text-gray-200 whitespace-pre-line">
        {expandido ? textoRespuesta : textoCorto}
      </p>

      {/* Botón Mostrar más / menos */}
      {textoRespuesta.length > limite && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="mt-1 text-gray-500 hover:underline text-sm"
        >
          {expandido ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}

      {/* Archivos adjuntos */}
      {Array.isArray(respuesta.archivos) && respuesta.archivos.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-gray-300 font-medium flex items-center gap-2">
            <Paperclip size={16} />
            Archivos adjuntos:
          </p>

          {respuesta.archivos.map((archivo, i) => {
            const enlace =
              archivo.archivo_url ||
              archivo.archivo ||
              (archivo instanceof File ? URL.createObjectURL(archivo) : archivo);

            const nombreArchivo =
              archivo.nombre ||
              (archivo instanceof File ? archivo.name : enlace.split("/").pop() || "archivo");

            const extension = enlace.split(".").pop().toLowerCase();
            const esImagen = ["png", "jpg", "jpeg", "gif", "webp"].includes(extension);

            return (
              <div
                key={archivo.id || i}
                className="border border-gray-700 p-3 rounded-xl bg-gray-900 flex flex-col gap-2"
              >
                {esImagen ? (
                  <img
                    src={enlace}
                    alt="adjunto"
                    className="rounded-lg max-h-64 object-cover cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <a
                    href={enlace}
                    download={nombreArchivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-500 break-all"
                  >
                    📎 {nombreArchivo}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">Respuesta de {respuesta.autor || "Anonimo"}</span>
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