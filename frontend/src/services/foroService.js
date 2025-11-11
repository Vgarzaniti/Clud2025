import api from "./api";
import { materiaService } from "./materiaService";

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data; 
  if (data?.results) return data.results;
  return [];
};

export const foroService = {

  obtenerTodos: async () => {
    const response = await api.get("/foros/");
    const foros = response.data;
    const materias = await materiaService.obtenerTodos();

    return foros.map((foro) => {
      const materia = materias.find((m) => m.idMateria === foro.materia);
      return {
        ...foro,
        materia_nombre: materia ? materia.nombre : "Sin materia",
        carrera_nombre: materia ? materia.carrera_nombre : "Sin carrera",
      };
    });
  },

  obtenerPorId: async (id) => {
    try {
      const res = await api.get(`/foros/${id}/?format=json`);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al obtener el foro con ID ${id}:`, error);
      throw error;
    }
  },

  crear: async (datos) => {
    try {
      const res = await api.post(`/foros/`, datos);
      return res.data;
    } catch (error) {
      console.error("❌ Error al crear el foro:", error);
      throw error;
    }
  },

  editar: async (id, datos) => {
    try {
      const res = await api.put(`/foros/${id}/`, datos);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al editar foro ${id}:`, error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      await api.delete(`/foros/${id}/`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Error al eliminar foro ${id}:`, error);
      throw error;
    }
  },

  buscar: async (query) => {
    try {
      const res = await api.get(`/foros/?search=${encodeURIComponent(query)}&format=json`);
      return normalizarRespuesta(res.data);
    } catch (error) {
      console.error("❌ Error al buscar foros:", error);
      throw error;
    }
  },
};
