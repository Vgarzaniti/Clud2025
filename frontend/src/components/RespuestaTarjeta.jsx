import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Paperclip } from "lucide-react";
import { puntajeService } from "../services/puntajeService.js";
import { respuestaService} from "../services/respuestaService.js";
import { useAuth } from "../context/useAuth.js";
import Modal from "./Modal";

export default function RespuestaTarjeta({ respuesta, onVoto }) {
    
    const { usuario } = useAuth();
    const textoRespuesta = respuesta.respuesta_texto || respuesta.respuesta || respuesta.contenido || "";
    const [enviando, setEnviando] = useState(false);
    const [puntaje, setPuntaje] = useState(respuesta.puntaje_neto ?? 0);
    const [voto, setVoto] = useState(respuesta.voto_usuario ?? 0);
    const [nombreForo, setNombreForo] = useState("");
    const [expandido, setExpandido] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("");
    
    const limite = 100;

    useEffect(() => {
      let activo = true;

      const cargarNombreForo = async () => {
        try {
          const foro = await respuestaService.obtenerForoDeRespuesta(respuesta.foro);

          if (activo) {
            setNombreForo(foro?.pregunta || "Foro desconocido");
          }
        } catch (error) {
          console.error("Error al obtener foro:", error);
          if (activo) setNombreForo("Foro desconocido");
        }
      };

      if (respuesta?.foro) {
        cargarNombreForo();
      }

      return () => {
        activo = false;
      };
    }, [respuesta.foro]);

    
    const handleUpvote = async () => {
      if (enviando) return;
      const nuevoValor = voto === 1 ? 0 : 1;
      const delta = nuevoValor - voto;
  
      try {
        setEnviando(true);

        console.log("Usuario votando:", usuario);

        const data = await puntajeService.votar({
          respuestaId: respuesta.idRespuesta,
          usuarioId: usuario.idUsuario,
          valor: nuevoValor
        });
        
        console.log("Respuesta al votar 👍:", data);
        setVoto(nuevoValor);
        setPuntaje(data.puntaje_neto);
        onVoto(respuesta.idRespuesta, delta, nuevoValor);
      } catch (error) {
        console.error("Error al votar 👍", error);
        setMensajeModal("Ya votaste esta respuesta.");
        setMostrarModal(true);
        return;
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
        const data = await puntajeService.votar({
          respuestaId: respuesta.idRespuesta,
          usuarioId: usuario.idUsuario,
          valor: nuevoValor,
        });
        setVoto(nuevoValor);
        setPuntaje(data.puntaje_neto);
        onVoto(respuesta.idRespuesta, delta, nuevoValor);
      } catch (error) {
        console.error("Error al votar 👍", error);
        setMensajeModal("Ya votaste esta respuesta.");
        setMostrarModal(true);
        return;
      } finally {
        setEnviando(false);
      }
    };
    useEffect(() => {
      setPuntaje(respuesta.puntaje_neto ?? 0);
    }, [respuesta.puntaje_neto]);
    useEffect(() => {
      setVoto(respuesta.voto_usuario ?? 0);
    }, [respuesta.voto_usuario]);
    const textoCorto =
      textoRespuesta.length > limite
        ? textoRespuesta.slice(0, limite) + "..."
        : textoRespuesta;
    return (
    <div className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md">
      
      <p className="text-gray-200 whitespace-pre-line break-words break-all overflow-hidden">
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
        <div className="flex flex-col">
            <span className="text-sm text-gray-400">
              Respuesta de {respuesta.autor || "Anónimo"}
            </span>
            <span className="text-sm text-gray-500 mt-2">
              Del Foro {nombreForo || "Cargando..."}
            </span>
          </div>        
        <div className="flex items-center gap-2">
          <button
            disabled={enviando || voto === 1}
            onClick={handleUpvote}
            className={`p-2 rounded-lg border transition-all duration-150
              ${voto === 1
                ? "bg-green-600 border-green-500 scale-110 shadow-md text-white"
                : "bg-fondo border-gray-500 hover:bg-gray-800"}
            `}
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
            disabled={enviando || voto === -1}
            onClick={handleDownvote}
            className={`p-2 rounded-lg border transition-all duration-150
              ${voto === -1
                ? "bg-red-600 border-red-500 scale-110 shadow-md text-white"
                : "bg-fondo border-gray-500 hover:bg-gray-800"}
            `}
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>
      <Modal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
      >
        <h3 className="text-lg font-semibold text-white mb-3">
          Acción no permitida
        </h3>
        <p className="text-gray-300 mb-6">
          {mensajeModal}
        </p>
        <button
          onClick={() => setMostrarModal(false)}
          className="w-full bg-azulUTN hover:bg-blue-500 transition py-2 rounded-lg text-white font-semibold"
        >
          Entendido
        </button>
      </Modal>
    </div>
  );
}