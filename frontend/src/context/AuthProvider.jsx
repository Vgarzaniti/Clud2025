import { useEffect, useState } from "react";
import authService from "../services/userService";
import { AuthContext } from "./AuthContext";
import { clearStoredVotes } from "../utils/voteStorage";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUsuario(data.usuario);
  };

  const actualizarUsuario = (data) => {
    setUsuario(data);
  };


  const logout = async () => {
    const idUsuario = usuario?.idUsuario;

    // 🔥 cortar sesión inmediatamente
    setUsuario(null);

    // limpiar datos locales
    if (idUsuario) {
      clearStoredVotes(idUsuario);
    }

    try {
      await authService.logout();
    } catch (error) {
      // opcional: loggear error, pero NO restaurar sesión
      console.error("Error al cerrar sesión", error);
    }
  };


  return (
    <AuthContext.Provider value={{ usuario, login, actualizarUsuario,logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
