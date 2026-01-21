import axios from "axios";

const api = axios.create({
  baseURL: "https://clud2025.onrender.com/api",
});

/**
 * 🔹 Interceptor de REQUEST
 * - Usa JSON para requests normales
 * - NO fuerza Content-Type cuando es FormData
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 🔹 Interceptor de RESPONSE (logging)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Error en API:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;
