import api from './api';

export const foroService = {
    
    obtenerTodos: async () => {
        const response = await api.get('/foros');
        return response.data;
    },

    obtenerPorId: async (id) => {
        const res = await api.get(`/foros/${id}`);
        return res.data;
    },

    crear: async (datos) => {
        const res = await api.post("/foros", datos);
        return res.data;
    },

    editar: async (id, datos) => {
        const res = await api.put(`/foros/${id}`, datos);
        return res.data;
    },

    eliminar: async (id) => {
        const res = await api.delete(`/foros/${id}`);
        return res.data;
    },

    buscar: async (query) => {
        const res = await api.get(`/foros?search=${query}`);
        return res.data;
    },
}