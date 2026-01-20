import api from './api';

const userService = {

    obtenerTodos: async () => {
        const res = await api.get("/usuarios/");
        return res.data;
    },

    obtenerPorId: async (id) => {
        const res = await api.get(`/usuarios/${id}/`);
        return res.data;
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
        console.log("Usuario nuevo", res.data);
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
    }

}

export default userService;

