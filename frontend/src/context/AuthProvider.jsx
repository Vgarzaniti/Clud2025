import { useEffect, useState } from "react";
import authService from "../services/userService";
import { AuthContext } from "./AuthContext";
import { clearStoredVotes } from "../utils/voteStorage";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

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

    setUsuario(null);

    if (idUsuario) {
      clearStoredVotes(idUsuario);
    }

    try {

      await authService.logout();
    
    } catch (error) {

      console.error("Error al cerrar sesión", error);
    }
  };


  return (
    <AuthContext.Provider value={{ usuario, login, actualizarUsuario,logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
