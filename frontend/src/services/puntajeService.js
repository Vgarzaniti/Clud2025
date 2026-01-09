import api from "./api";

export const puntajeService = {

    votar: async (respuestaId, valor) => {
        const res = await api.post("/puntajes/", {
            respuesta: respuestaId,
            valor
        });
        return res.data;
    }
}