import api from "./api";

export const respuestaService = {
  
  obtenerPorTodos: async () => {
    const res = await api.get(`/respuestas/`);
    console.log("Respuestas obtenidas:", res.data);
    return res.data;
  },

  obtenerPorForo: async (foroId) => {
    const res = await api.get(`/respuestas/?foro=${foroId}`);
    return res.data;
  },

  async crear(formData) {
    try {
      // axios detecta automáticamente FormData y pone el Content-Type correcto
      const { data } = await api.post("/respuestas/", formData);
      return data;
    } catch (error) {
      console.error("❌ ERROR en la API:", error.response?.data || error.message);
      throw error;
    }
  },
  
  editar: async(id, datos) =>{
    try{
      const res = await api.patch(`/respuestas/${id}/`, datos);
      return res.data;
    } catch (error) {
      console.error(`❌ Error en la API con la respuesta ${id}:`, error);
      throw error;
    }
  },

  eliminar: async (id) => {
    const response = await api.delete(`/respuestas/${id}`);
    return response.data;
  },

  // =============================
  // OBTENER RESPUESTAS POR ID DE USUARIO
  // =============================

  obtenerRespuestasPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get("/respuestas/");
      const foros = response.data;

      // Filtrar respuestas que coincidan con el ID del usuario
      const respuestasFiltradas = foros.filter(
        (respuesta) => String(respuesta.usuario) === String(usuarioId)
      );

      return Promise.all(respuestasFiltradas);
    } catch (error) {
      console.error(`❌ Error al obtener respuestas del usuario ${usuarioId}:`, error);
      throw error;
    }
  },
};
