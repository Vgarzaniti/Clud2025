import api from "./api";

export const materiaService = {
    
    obtenerTodos: async () => {
        const response = await api.get(`/materias`);
        return response.data;
    },

    obtenerPorId: async (id) => {
        const response = await api.get(`/materias/${id}`);
        return response.data;
    }

};
