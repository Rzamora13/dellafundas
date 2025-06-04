import React, { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);

  // Estado para indicar si hay una carga en curso
  const [loading, setLoading] = useState(false);

  // Estado para almacenar errores (si los hay)
  const [error, setError] = useState(null);

  // Función para obtener todos los usuarios desde la API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message); 
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un usuario por su ID
  const getUser = async (id) => {
    try {
      return await userAPI.get(id);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      setError(error.message);
      return null;
    }
  };

  // Función para actualizar los roles de un usuario
  const updateUserRole = async (id, roles) => {
    try {
      await userAPI.updateRole(id, roles);
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, roles } : user
        )
      );
    } catch (error) {
      console.error(`Error updating roles for user ${id}:`, error);
      setError(error.message);
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    try {
      await userAPI.delete(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      setError(error.message);
    }
  };

  // Ejecuta la carga de usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Se devuelve el proveedor con los valores que se compartirán
  return (
    <UserContext.Provider value={{ users, loading, error, fetchUsers, getUser, updateUserRole, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto en otros componentes
export const useUsers = () => useContext(UserContext);
