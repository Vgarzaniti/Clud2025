import api from "./api";

export const respuestaService = {
    
    obtenerPorForo: async (foroId) => {
        const res = await api.get(`/respuestas/?foro=${foroId}`);
        return res.data;
    },

    crear: async (datos) => {
        const res = await api.post("/respuestas/", datos);
        return res.data;
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
