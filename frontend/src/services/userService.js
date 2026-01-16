import api from './api';

const userService = {
    
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
}

export default userService;

