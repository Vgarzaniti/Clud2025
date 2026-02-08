import api from "./api";
import { respuestaService } from "./respuestaService";

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
};

const normalizarForo = (foro) => {
  const usuario = foro.usuario ?? {};

  return {
    ...foro,
    usuario_nombre:
      usuario.nombreYapellido ||
      usuario.username ||
      "Usuario desconocido",
    nombreCompleto: usuario.nombreYapellido || "",
    materia_nombre: foro.materia_nombre ?? "Sin materia",
    carrera_nombre: foro.carrera_nombre ?? "Sin carrera",
  };
};


export const foroService = {
  
  // =============================
  // OBTENER TODOS
  // =============================
  obtenerTodos: async () => {
    const response = await api.get("/foros/");
    return Promise.all(response.data.map(normalizarForo));
  },

  // =============================
  // OBTENER POR ID
  // =============================
  obtenerPorId: async (id) => {
    try {
      const foroRes = await api.get(`/foros/${id}/`);
      const respuestas = await respuestaService.obtenerPorTodos();

      const respuestasDelForo = respuestas.filter(
        (r) => String(r.foro) === String(id)
      );

      const foroNormalizado = await normalizarForo(foroRes.data);

      return {
        ...foroNormalizado,
        totalRespuestas: respuestasDelForo.length,
      };
    } catch (error) {
      console.error(`❌ Error al obtener foro ${id}`, error);
      throw error;
    }
  },

  obtenerConUsuario: async (id) => {
    try {
      // Obtener foro
      const foroRes = await api.get(`/foros/${id}/`);
      const foro = foroRes.data;

      return {
        ...foro,
        nombreCompleto: foro.usuario?.nombreYapellido,
        username: foro.usuario?.username,
      };
    } catch (error) {
      const usuario = { username: "Usuario eliminado" }
      console.error("❌ Error al obtener foro con usuario", error);
      console.error(usuario)
      throw error;
    }
  },

  
  // =============================
  // CREAR (FORMDATA)
  // =============================
  crear: async (datos) => {
    try {
      const esFormData = datos instanceof FormData;

      const res = await api.post("/foros/", datos, {
        headers: esFormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
      });

      return res.data;
    } catch (error) {
      console.error("❌ Error al crear el foro:", error);
      throw error;
    }
  },

  // =============================
  // EDITAR (FORMDATA)
  // =============================
  editar: async (id, datos) => {
    try {
      const res = await api.patch(`/foros/${id}/`, datos);
      return res.data;
      
    } catch (error) {
      console.error(`❌ Error al editar foro ${id}`, error);
      throw error;
    }
  },

  // =============================
  // ELIMINAR FORO + RESPUESTAS VINCULADAS A ESTE
  // =============================
  eliminar: async (id) => {
    try {

      const respuestasDelForo = await respuestaService.obtenerRespuestasPorForo(id);
      console.log("Respuestas del foro:", respuestasDelForo);

      await Promise.all(
        respuestasDelForo.map((respuesta) => {
          if (!respuesta.idRespuesta) {
          console.warn("⚠️ Respuesta sin idRespuesta:", respuesta);
          return Promise.resolve();
        }

        return respuestaService.eliminar(respuesta.idRespuesta);
        })
      );

      await api.delete(`/foros/${id}/`);
      
      return { success: true };

    } catch (error) {

      console.error(`❌ Error al eliminar foro ${id}`, error);
      throw error;

    }
  },

  // =============================
  // BUSCAR
  // =============================
  buscar: async (query) => {
    try {
      const res = await api.get(
        `/foros/?pregunta=${encodeURIComponent(query)}`
      );
      return normalizarRespuesta(res.data);
    } catch (error) {
      console.error("❌ Error al buscar foros:", error);
      throw error;
    }
  },

  // =============================
  // BUSCAR POR USUARIO
  // =============================
  obtenerForosPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get("/foros/");
      const foros = response.data;
      
      // Filtrar foros que coincidan con el ID del usuario
      const forosFiltrados = foros.filter(
        (foro) => String(foro.usuario) === String(usuarioId)
      );
      
      return Promise.all(forosFiltrados.map(normalizarForo));
    } catch (error) {
      console.error(`❌ Error al obtener foros del usuario ${usuarioId}:`, error);
      throw error;
    }
  },
 
};
