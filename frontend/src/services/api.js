import axios from "axios";

const api = axios.create({
  baseURL: "https://clud2025.onrender.com/api",
});

/**
 * 🔹 Interceptor de REQUEST
 * - Usa JSON para requests normales
 * - NO fuerza Content-Type cuando es FormData
 */
api.interceptors.request.use(
  (config) => {
    // Si NO es FormData → usar JSON
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // 🔥 MUY IMPORTANTE: dejar que Axios setee multipart
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
