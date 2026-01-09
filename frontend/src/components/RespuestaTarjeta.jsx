import { useState } from "react";
import { ThumbsUp, ThumbsDown, Paperclip } from "lucide-react";
import { puntajeService } from "../services/puntajeService";

export default function RespuestaTarjeta({ respuesta, onVoto }) {
    const textoRespuesta = respuesta.respuesta_texto || respuesta.respuesta || respuesta.contenido || "";
    const [enviando, setEnviando] = useState(false);
    const [voto, setVoto] = useState(respuesta.voto_usuario ?? 0);
    const [expandido, setExpandido] = useState(false);
    const limite = 300;
    const userId = 1;

    const handleUpvote = async () => {

      if (enviando) return;

      const nuevoValor = voto === 1 ? 0 : 1;
      const delta = nuevoValor - voto;
  
      try {
        setEnviando(true);

        const data = await puntajeService.votar({
          respuestaId: respuesta.idRespuesta,
          usuarioId: userId,
          valor: nuevoValor
        });

        setVoto(data.voto_usuario);
        onVoto(respuesta.idRespuesta, delta);

      } catch (error) {

        console.error("Error al votar 👍", error);
        alert("No se pudo registrar el voto.");

      } finally {

        setEnviando(false);

      }
    };

    const handleDownvote = async () => {
      if (enviando) return;

      const nuevoValor = voto === -1 ? 0 : -1;
      const delta = nuevoValor - voto;

      try {
        setEnviando(true);

        await puntajeService.votar({
          respuestaId: respuesta.idRespuesta,
          usuarioId: userId,
          valor: nuevoValor,
        });

        setVoto(nuevoValor);
        onVoto(respuesta.idRespuesta, delta);
      } finally {
        setEnviando(false);
      }
    };


    const textoCorto =
      textoRespuesta.length > limite
        ? textoRespuesta.slice(0, limite) + "..."
        : textoRespuesta;

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
        <div className="mt-2 space-y-2">
          {respuesta.archivos.map((archivo, i) => {
            // Maneja diferentes estructuras posibles de archivo
            const enlace = archivo.archivo_url || archivo.archivo || (archivo instanceof File ? URL.createObjectURL(archivo) : archivo);

            // Extrae un nombre legible desde el link o el objeto File
            const nombreArchivo =
              archivo.nombre ||
              (archivo instanceof File ? archivo.name : enlace.split("/").pop() || "archivo_descargable");

            return (
              <div key={archivo.id || i} className="flex items-center gap-2 text-sm text-blue-400">
                <Paperclip size={16} />
                <a
                  href={enlace}
                  download={nombreArchivo} //permite descargar directamente
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-azulUTN hover:underline truncate max-w-[200px]"
                >
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
            disabled={enviando}
            onClick={handleUpvote}
            className={`p-2 rounded-lg border transition ${
              voto === 1
                ? "bg-green-600 border-green-500"
                : "bg-fondo border-gray-500 hover:bg-gray-800"
            }`}
          >
            <ThumbsUp size={16} />
          </button>

          <span
            className={`text-sm font-semibold w-8 text-center ${
              respuesta.puntaje_neto > 0
                ? "text-green-400"
                : respuesta.puntaje_neto < 0
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {respuesta.puntaje_neto}
          </span>

          <button
            disabled={enviando}
            onClick={handleDownvote}
            className={`p-2 rounded-lg border transition ${
              voto === -1
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