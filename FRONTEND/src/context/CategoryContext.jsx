import { createContext, useState, useEffect, useContext } from 'react';
import { categoryAPI } from '../services/api';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  // Estado que guarda la lista de categorías
  const [categories, setCategories] = useState([]);

  // Carga categorías automáticamente al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para obtener todas las categorías desde la API
  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // Función para crear una nueva categoría
  const createCategory = async (categoryData) => {
    try {
      await categoryAPI.create(categoryData);
      await fetchCategories();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  };

  // Función para actualizar una categoría existente
  const updateCategory = async (id, categoryData) => {
    try {
      await categoryAPI.update(id, categoryData);
      await fetchCategories();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      throw error;
    }
  };

  // Función para eliminar una categoría
  const deleteCategory = async (id) => {
    try {
      await categoryAPI.delete(id);
      await fetchCategories();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      throw error;
    }
  };

  // Provee los valores y funciones del contexto a los componentes hijos
  return (
    <CategoryContext.Provider value={{ categories, fetchCategories, createCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook personalizado para consumir fácilmente el contexto de categorías
export const useCategories = () => useContext(CategoryContext);
