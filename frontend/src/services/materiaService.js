import api from "./api";

export const materiaService = {
    obtenerTodos: async () => {
        const response = await api.get(`/materias/?format=json`);
        return Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
    },

    obtenerPorId: async (id) => {
        const response = await api.get(`/materias/${id}/?format=json`);
        return response.data;
    },

    obtenerPorCarrera: async (carreraId) => {
        const response = await api.get(`/materias/?format=json`);
        const materias = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
        return materias.filter((m) => m.carrera === carreraId);
    },

    obtenerPorAno: async (ano) => {
        const response = await api.get(`/materias/?format=json`);
        const materias = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
        return materias.filter((m) => m.ano === ano);
    },
};


