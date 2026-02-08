import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Paperclip } from "lucide-react";
import { puntajeService } from "../services/puntajeService.js";
import { respuestaService} from "../services/respuestaService.js";
import usePersistedVote from "../hooks/usePersistedVote";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function RespuestaTarjeta({ respuesta, onVoto }) {
    const navigate = useNavigate()
    const { usuario } = useAuth();
    const textoRespuesta = respuesta.respuesta_texto || respuesta.respuesta || respuesta.contenido || "";
    const [enviando, setEnviando] = useState(false);
    const [puntaje, setPuntaje] = useState(respuesta.puntaje_neto ?? 0);
    
    const { voto, setVoto } = usePersistedVote({
      userId: usuario.idUsuario,
      respuestaId: respuesta.idRespuesta,
      backendVote: respuesta.voto_usuario,
    });
    
    const [foro, setForo] = useState(null);
    const [expandido, setExpandido] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("");
    
    const limite = 100;

    const [expandidoForo, setExpandidoForo] = useState(false);
    const limiteForo = 80;

    const tituloForoCorto =
      foro?.pregunta?.length > limiteForo
        ? foro.pregunta.slice(0, limiteForo) + "..."
        : foro?.pregunta;



    useEffect(() => {
      let activo = true;

      const cargarNombreForo = async () => {
        try {
          const foroData = await respuestaService.obtenerForoDeRespuesta(respuesta.foro);

          if (activo) {
            setForo(foroData);
          }
        } catch (error) {
          console.error("Error al obtener foro:", error);
          if (activo) setForo(null);
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


        const data = await puntajeService.votar({
          respuestaId: respuesta.idRespuesta,
          usuarioId: usuario.idUsuario,
          valor: nuevoValor
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
    
    const textoCorto =
      textoRespuesta.length > limite
        ? textoRespuesta.slice(0, limite) + "..."
        : textoRespuesta;
    
  return (
    <div className="bg-panel p-5 rounded-2xl border border-gray-700 shadow-md w-full max-w-full overflow-hidden">
      
      <p className="text-gray-200 whitespace-pre-line break-words overflow-hidden">
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

            const enlace = archivo.archivo_url || archivo.archivo || (archivo instanceof File ? URL.createObjectURL(archivo) : archivo);

            const nombreArchivo =
              archivo.nombre ||
              (archivo instanceof File ? archivo.name : enlace.split("/").pop() || "archivo_descargable");
            return (
              <div key={archivo.id || i} className="flex items-center gap-2 text-sm text-blue-400">
                <Paperclip size={16} />
                <a
                  href={enlace}
                  download={nombreArchivo}
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
              Respuesta de {respuesta.usuario_username || "Anónimo"}
            </span>
           <span className="text-sm text-gray-500 mt-2 mr-3">
              Del Foro:{" "}
              {foro ? (
                <span className="inline">
                  <span
                    onClick={() => navigate(`/foro/${foro.idForo}`)}
                    className="text-blue-300 cursor-pointer break-words"
                  >
                    {expandidoForo ? foro.pregunta : tituloForoCorto}
                  </span>

                  {foro.pregunta.length > limiteForo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandidoForo(!expandidoForo);
                      }}
                      className="ml-1 text-xs text-gray-400 hover:underline"
                    >
                      {expandidoForo ? "Mostrar menos" : "Mostrar más"}
                    </button>
                  )}
                </span>
              ) : (
                "Cargando..."
              )}
            </span>
          </div>        
        <div className="flex items-center gap-2">
          <button
            disabled={enviando}
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
            disabled={enviando}
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