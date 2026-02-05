import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
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

