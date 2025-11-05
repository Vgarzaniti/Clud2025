import api from "./api";

export const respuestaService = {
    
    obtenerPorForo: async (foroId) => {
        const response = await api.get(`/respuestas?foroId=${foroId}`);
        return response.data;
    },

    crear: async (datos) => {
        const response = await api.post("/respuestas", datos);
        return response.data;
    },

    editar: async (id, datos) => {
        const response = await api.put(`/respuestas/${id}`, datos);
        return response.data;
    },

    eliminar: async (id) => {
        const response = await api.delete(`/respuestas/${id}`);
        return response.data;
    },
};
