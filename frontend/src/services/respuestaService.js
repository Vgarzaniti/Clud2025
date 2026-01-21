import api from "./api";

export const respuestaService = {
  
  obtenerPorTodos: async () => {
    const res = await api.get(`/respuestas/`);
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

  buscarUsuario: async (usuarioId) => {
    try {
      const res = await api.get(`/respuestas/?usuario=${usuarioId}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error al buscar respuestas por UsuarioId:", error);
      throw error;
    }
  },

  misRespuestas: async () => {
    const res = await api.get("/respuestas/mias/");
    return res.data;
  },
};
