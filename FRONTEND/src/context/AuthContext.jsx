import { createContext, useContext, useState, useEffect } from "react";

//---------- URL BASE ----------\\
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_PORT = import.meta.env.VITE_PORT;

const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado que almacena el usuario autenticado
  const [user, setUser] = useState(null);

  // Al montar el componente, revisa si hay un usuario guardado en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Asegura que los roles estén en forma de array
      if (parsedUser && typeof parsedUser.roles === "string") {
        parsedUser.roles = JSON.parse(parsedUser.roles);
      }
      setUser(parsedUser);
    }
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    const response = await fetch(`${VITE_BASE_URL}:${VITE_PORT}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Asegura que los roles estén en forma de array
      if (data && typeof data.roles === "string") {
        data.roles = JSON.parse(data.roles);
      }
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      throw new Error(data.error || "Error en el login");
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (email, password) => {
    const response = await fetch(`${VITE_BASE_URL}:${VITE_PORT}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en el registro");
    }

    return data.message || "Registro exitoso";
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Proporciona los datos y funciones del contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación desde otros componentes
export const useAuth = () => useContext(AuthContext);
