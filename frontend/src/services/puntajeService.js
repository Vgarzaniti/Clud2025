import api from "./api";

export const puntajeService = {
  votar: async ({ respuestaId, usuarioId, valor }) => {
    const payload = {
      respuesta: respuestaId, 
      usuario: usuarioId,
      valor
    };

    console.log("📤 Enviando voto:", payload); 

    const { data } = await api.post("/puntaje/", payload);
    return data;
  }
};