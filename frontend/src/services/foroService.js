import api from "./api";
import { respuestaService } from "./respuestaService";

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
};

export const foroService = {
  
  // =============================
  // OBTENER TODOS
  // =============================
  obtenerTodos: async () => {
  
    const response = await api.get("/foros/");

    return response.data.map((foro) => ({
      ...foro,
      usuario_nombre: foro.usuario?.username ?? "Usuario desconocido",
      nombreCompleto: foro.usuario?.nombreYapellido ?? "",
      materia_nombre: foro.materia?.nombre ?? "Sin materia",
    }));
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

      return {
        ...foroRes.data,
        totalRespuestas: respuestasDelForo.length,
      };
    } catch (error) {
      console.error(`❌ Error al obtener foro ${id}`, error);
      throw error;
    }
  },

  // =============================
  // CREAR (FORMDATA)
  // =============================
  crear: async (datos) => {
    try {
      // 🔥 NO forzar Content-Type: Axios lo manejará automáticamente con FormData
      const res = await api.post("/foros/", datos);
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
      // 🔥 NO forzar Content-Type: Axios lo manejará automáticamente con FormData
      const res = await api.put(`/foros/${id}/`, datos);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al editar foro ${id}`, error);
      throw error;
    }
  },

  // =============================
  // ELIMINAR
  // =============================
  eliminar: async (id) => {
    try {
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
  buscarUsuario: async (usuarioId) => {
    try {
      const res = await api.get(`/foros/?usuario=${usuarioId}`);
      return normalizarRespuesta(res.data);
    } catch (error) {
      console.error("❌ Error al buscar foros por usuario:", error);
      throw error;
    }
  },
};
