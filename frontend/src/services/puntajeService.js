import api from "./api";

export const puntajeService = {
  votar: async ({ respuestaId, valor, userId }) => {
    const payload = {
      respuesta: respuestaId,
      usuario: userId, 
      valor
    };

    console.log("PUNTAJE SERVICE CARGADO");
    console.log("📤 Enviando voto:", payload); 

    const { data } = await api.post("/puntaje/", payload);
    return data;
  }
};