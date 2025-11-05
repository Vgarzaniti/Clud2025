import axios from 'axios';

const api = axios.create({
    baseURL: "https://clud2025.onrender.com/api",
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;