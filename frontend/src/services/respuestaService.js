import api from "./api";

export const respuestaService = {
    
    obtenerPorTodos: async () => {
        const res = await api.get(`/respuestas/`);
        return res.data;
    },
    
    obtenerPorForo: async (foroId) => {
        const res = await api.get(`/respuestas/?foro=${foroId}`);
        return res.data;
    },

    async crear(formData) {
        const { data } = await api.post("/respuestas/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },

    async editar(id, formData) {
        const { data } = await api.put(`/respuestas/${id}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },


    eliminar: async (id) => {
        const response = await api.delete(`/respuestas/${id}`);
        return response.data;
    },

    buscarUsuario: async (usuarioId) => {
        try {
            const res = await api.get(`/respuestas/?usuario=${usuarioId}`);
            return res.data
        } catch (error) {
            console.error("❌ Error al buscar respuestas por UsuarioId:", error);
            throw error;
        }
    }
};
