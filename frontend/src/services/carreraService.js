import api from "./api";

export const carreraService = {
    
    obtenerTodos: async () => {
        const response = await api.get(`/carreras`);
        return response.data;
    },

    obtenerPorId: async (id) => {
        const response = await api.get(`/carreras/${id}`);
        return response.data;
    }

};
