import { createContext, useState, useEffect, useContext } from 'react';
import { artistAPI } from '../services/api';

const ArtistContext = createContext();

export const ArtistProvider = ({ children }) => {
  // Estado local para almacenar la lista de artistas
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  // Función para obtener todos los artistas desde la API y guardarlos en el estado
  const fetchArtists = async () => {
    try {
      const data = await artistAPI.getAll();
      setArtists(data);
    } catch (error) {
      console.error("Error al cargar artistas:", error);
    }
  };

  // Función para crear un nuevo artista
  const createArtist = async (artistData) => {
    try {
      await artistAPI.create(artistData);
      await fetchArtists();
    } catch (error) {
      console.error("Error al crear artista:", error);
      throw error;
    }
  };

  // Función para actualizar un artista existente
  const updateArtist = async (id, artistData) => {
    try {
      await artistAPI.update(id, artistData);
      await fetchArtists();
    } catch (error) {
      console.error("Error al actualizar artista:", error);
      throw error;
    }
  };

  // Función para eliminar un artista por su ID
  const deleteArtist = async (id) => {
    try {
      await artistAPI.delete(id);
      await fetchArtists();
    } catch (error) {
      console.error("Error al eliminar artista:", error);
      throw error;
    }
  };

  // Retorna el proveedor con los valores y funciones disponibles en el contexto
  return (
    <ArtistContext.Provider value={{ artists, fetchArtists, createArtist, updateArtist, deleteArtist, }}>
      {children}
    </ArtistContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto desde otros componentes
export const useArtists = () => useContext(ArtistContext);
