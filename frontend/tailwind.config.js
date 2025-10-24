/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: "#08061aff", // fondo general oscuro
        panel: "#1B173D", // paneles (sidebar y tarjetas)
        azulUTN: "#4A7CFF", // botones, acentos
        texto: "#E5E7EB", // texto claro
        perfilPanel: "#38385aff", // panel lateral del perfil
      },
    },
  },
  plugins: [],
}

