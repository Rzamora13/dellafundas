import React, { useState, useEffect } from "react";
import { useCategories } from "../context/CategoryContext";
import { useArtists } from "../context/ArtistContext";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const Filters = () => {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { artists, fetchArtists, createArtist, updateArtist, deleteArtist } = useArtists();

  // Estado para el nombre de la nueva categoría que se quiere crear
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newArtistName, setNewArtistName] = useState("");

  // Estados para manejar edición de categorías (id y nombre editable)
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  // Estados para manejar edición de artistas (id y nombre editable)
  const [editingArtist, setEditingArtist] = useState(null);
  const [editingArtistName, setEditingArtistName] = useState("");

  // Estado para controlar si el modal de confirmación está abierto
  const [modalOpen, setModalOpen] = useState(false);
  // Estado para almacenar el ítem que se quiere eliminar (categoría o artista)
  const [itemToDelete, setItemToDelete] = useState(null);

  // Efecto para cargar las categorías y artistas al montar el componente
  useEffect(() => {
    fetchCategories();
    fetchArtists();
  }, []);

  // Función para agregar una nueva categoría
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Introduce un nombre válido.");
      return;
    }
    try {
      await createCategory({ name: newCategoryName.trim() }); // Crear categoría
      setNewCategoryName(""); // Limpiar input
      toast.success("Categoría creada correctamente");
    } catch {
      toast.error("Error al crear categoría");
    }
  };

  // Función para iniciar la edición de una categoría, cargando sus datos en estado
  const handleStartEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditingCategoryName(category.name);
  };

  // Función para guardar la categoría editada
  const handleSaveCategory = async (id) => {
    if (!editingCategoryName.trim()) {
      toast.error("Introduce un nombre válido.");
      return;
    }
    try {
      await updateCategory(id, { name: editingCategoryName.trim() });
      setEditingCategory(null);      // Salir de modo edición
      setEditingCategoryName("");    // Limpiar input edición
      toast.success("Categoría actualizada correctamente");
    } catch {
      toast.error("Error al actualizar categoría");
    }
  };

  // Cancelar la edición de categoría y limpiar estados
  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setEditingCategoryName("");
  };

  // Funciones equivalentes para artistas (añadir, editar, guardar, cancelar)
  const handleAddArtist = async () => {
    if (!newArtistName.trim()) {
      toast.error("Introduce un nombre válido.");
      return;
    }
    try {
      await createArtist({ name: newArtistName.trim() });
      setNewArtistName("");
      toast.success("Artista creado correctamente");
    } catch {
      toast.error("Error al crear artista");
    }
  };

  const handleStartEditArtist = (artist) => {
    setEditingArtist(artist.id);
    setEditingArtistName(artist.name);
  };

  const handleSaveArtist = async (id) => {
    if (!editingArtistName.trim()) {
      toast.error("Introduce un nombre válido.");
      return;
    }
    try {
      await updateArtist(id, { name: editingArtistName.trim() });
      setEditingArtist(null);
      setEditingArtistName("");
      toast.success("Artista actualizado correctamente");
    } catch {
      toast.error("Error al actualizar artista");
    }
  };

  const handleCancelEditArtist = () => {
    setEditingArtist(null);
    setEditingArtistName("");
  };

  // Función para abrir modal y confirmar eliminación de categoría
  const confirmDeleteCategory = (category) => {
    setItemToDelete({ type: "category", id: category.id, name: category.name });
    setModalOpen(true);
  };

  // Función para abrir modal y confirmar eliminación de artista
  const confirmDeleteArtist = (artist) => {
    setItemToDelete({ type: "artist", id: artist.id, name: artist.name });
    setModalOpen(true);
  };

  // Función para ejecutar la eliminación tras confirmación
  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === "category") {
        await deleteCategory(itemToDelete.id);
        toast.success("Categoría eliminada correctamente");
      } else {
        await deleteArtist(itemToDelete.id);
        toast.success("Artista eliminado correctamente");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al eliminar";
      toast.error(errorMessage);
    } finally {
      setModalOpen(false);
      setItemToDelete(null);
    }
  };
  

  // Cancelar eliminación y cerrar modal
  const handleDeleteCancelled = () => {
    setModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-4 sm:p-8 bg-gray-100">
      {/* Título principal */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Administración de filtros</h1>

      {/* Sección Categorías */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Categorías</h2>

        {/* Input y botón para añadir nueva categoría */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nueva categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleAddCategory}
            className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
          >
            Añadir
          </button>
        </div>

        {/* Lista de categorías */}
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 bg-white sm:bg-transparent rounded-md shadow sm:shadow-none p-4 sm:p-0"
            >
              {/* Si está editando esta categoría, mostrar inputs para editar */}
              {editingCategory === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleSaveCategory(category.id)}
                      className="bg-[#4CAF50] text-white px-4 py-1 rounded hover:bg-green-700 w-full sm:w-auto"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEditCategory}
                      className="bg-[#E63946] text-white px-4 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                // Si no está editando, mostrar nombre y botones para editar/eliminar
                <>
                  <span className="w-full break-words">{category.name}</span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleStartEditCategory(category)}
                      className="bg-[#3A86FF] text-white px-4 py-1 rounded hover:bg-blue-700 w-full sm:w-auto"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDeleteCategory(category)}
                      className="bg-[#E63946] text-white px-4 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Sección Artistas - igual estructura que categorías */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Artistas</h2>

        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nuevo artista"
            value={newArtistName}
            onChange={(e) => setNewArtistName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleAddArtist}
            className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
          >
            Añadir
          </button>
        </div>

        <ul className="space-y-2">
          {artists.map((artist) => (
            <li
              key={artist.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 bg-white sm:bg-transparent rounded-md shadow sm:shadow-none p-4 sm:p-0"
            >
              {editingArtist === artist.id ? (
                <>
                  <input
                    type="text"
                    value={editingArtistName}
                    onChange={(e) => setEditingArtistName(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleSaveArtist(artist.id)}
                      className="bg-[#4CAF50] text-white px-4 py-1 rounded hover:bg-green-700 w-full sm:w-auto"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEditArtist}
                      className="bg-[#E63946] text-white px-4 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="w-full break-words">{artist.name}</span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleStartEditArtist(artist)}
                      className="bg-[#3A86FF] text-white px-4 py-1 rounded hover:bg-blue-700 w-full sm:w-auto"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDeleteArtist(artist)}
                      className="bg-[#E63946] text-white px-4 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Modal para confirmar eliminación */}
      <Modal
        title="Confirmar eliminación"
        isOpen={modalOpen}
        onClose={handleDeleteCancelled}
      >
        <p>¿Seguro que quieres eliminar <strong>{itemToDelete?.name}</strong>?</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleDeleteCancelled}
            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteConfirmed}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Filters;
