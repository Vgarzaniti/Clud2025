import api from "./api";

export const puntajeService = {
  votar: async ({ respuestaId, valor, usuarioId }) => {

    const payload = {
      respuesta: respuestaId,
      usuario: usuarioId, 
      valor
    };

    console.log("PUNTAJE SERVICE CARGADO");

    try {
      const { data } = await api.post("/puntaje/", payload);
      return data;
      
    } catch (error) {
      console.error("❌ Error en voto:", error.response?.data || error.message);
      throw error;
    }
  }
};