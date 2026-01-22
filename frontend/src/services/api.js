import axios from "axios";

const api = axios.create({
  baseURL: "https://clud2025.onrender.com/api",
  withCredentials: true,
});

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token"); // o el nombre que uses

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

export default api;

