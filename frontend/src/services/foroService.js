import api from "./api";
import { materiaService } from "./materiaService";
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
    const foros = response.data;
    const materias = await materiaService.obtenerTodos();

    return foros.map((foro) => {
      const materia = materias.find((m) => m.idMateria === foro.materia);
      return {
        ...foro,
        materia_nombre: materia?.nombre || "Sin materia",
        carrera_nombre: materia?.carrera_nombre || "Sin carrera",
      };
    });
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
      const esFormData = datos instanceof FormData;

      const res = await api.put(`/foros/${id}/`, datos, {
        headers: esFormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
      });

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
