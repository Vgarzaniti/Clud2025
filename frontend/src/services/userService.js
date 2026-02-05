import api from './api';

const userService = {

    obtenerTodos: async () => {
        const res = await api.get("/usuarios/");
        return res.data;
    },

    obtenerPorId: async (id) => {
        const res = await api.get("/usuarios/");
        const usuarios = res.data;

        const usuario = usuarios.find(
            (u) => String(u.idUsuario) === String(id)
        );

        return usuario || null;
    },
    
    login: async (email, password) => {
        const res = await api.post("/login/", {
            login: true,
            email,
            password,
        });
        return res.data;
    },

    register: async (data) => {
        const res = await api.post("/login/", {
            ...data,
        });
        return res.data;
        
    },

    me: async () => {
        const res = await api.get("/usuario/me/");
        return res.data;
    },

    logout: async () => {
        await api.post("/logout/");
    },

    cambiarDatos: async ({ username, passwordActual, passwordNueva }) => {
        const payload = {};

        if (username) payload.nuevo_username = username;

        if (passwordNueva) {
            payload.password_actual = passwordActual;
            payload.password_nueva = passwordNueva;
        }

        return api.patch("/usuario/cambiar_datos/", payload, {
            withCredentials: true,
        });
    },

    obtenerPorIdForo: async (usuarioId) => {
        try {
            const res = await api.get("/usuarios/");
            const usuarios = res.data;
            

            const usuario = usuarios.find(
                (u) => String(u.idUsuario) === String(usuarioId)
            );
            
            if (usuario) {
                return {
                    id: usuario.idUsuario,
                    nombreCompleto: `${usuario.nombreYapellido}`, // Asegúrate de que estos campos existan
                };
            }
            return null;
        } catch (error) {
            console.error(`❌ Error al obtener usuario ${usuarioId}:`, error);
            throw error;
        }
    },

}

export default userService;

