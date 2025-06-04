import React, { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../context/CategoryContext";
import { useArtists } from "../context/ArtistContext";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const Product = () => {
  // Extraemos funciones y estados del contexto de productos
  const {products, fetchProducts, deleteProduct, importProductsFromCSV, loading } = useProducts();

  const { user } = useAuth();
  const { categories } = useCategories();
  const { artists } = useArtists();

  const [modalOpen, setModalOpen] = useState(false);        // Controla si el modal está abierto
  const [productToEdit, setProductToEdit] = useState(null); // Producto seleccionado para editar
  const [selectedCategory, setSelectedCategory] = useState(""); // Categoría seleccionada para filtrar
  const [selectedArtist, setSelectedArtist] = useState("");     // Artista seleccionado para filtrar
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados según selección
  const [searchParams] = useSearchParams();                      // Parámetros de URL
  const [csvFile, setCsvFile] = useState(null);                  // Archivo CSV seleccionado

  const csvInputRef = useRef(null); // Referencia para el input de archivo CSV, para resetearlo

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // Al cargar o cambiar parámetros en URL, actualizar categoría seleccionada
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "";
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  // Cada vez que cambian productos o filtros, actualizar lista filtrada
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría si está seleccionada
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.id === parseInt(selectedCategory));
    }

    // Filtrar por artista si está seleccionado
    if (selectedArtist) {
      filtered = filtered.filter((p) => p.artist?.id === parseInt(selectedArtist));
    }

    setFilteredProducts(filtered); // Actualizar productos filtrados en estado
  }, [products, selectedCategory, selectedArtist]);

  // Abrir modal para crear un nuevo producto
  const handleCreate = () => {
    setProductToEdit(null); // No hay producto a editar, es creación nueva
    setModalOpen(true);
  };

  // Abrir modal para editar un producto existente
  const handleEdit = (product) => {
    setProductToEdit(product);
    setModalOpen(true);
  };

  // Eliminar producto y actualizar lista tras éxito
  const handleDelete = async (productId) => {
    const success = await deleteProduct(productId);
    if (success) {
      fetchProducts(); // Refrescar productos tras eliminación
    }
  };

  // Cerrar modal y refrescar productos (usado tras crear o editar)
  const handleCloseModal = () => {
    setModalOpen(false);
    fetchProducts();
  };

  // Al cambiar archivo CSV seleccionado, guardarlo en estado
  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  // Importar productos desde archivo CSV
  const handleImportCsv = async () => {
    if (!csvFile) {
      toast.warn("Selecciona un archivo CSV antes de importar."); // Aviso si no hay archivo
      return;
    }

    try {
      const result = await importProductsFromCSV(csvFile);

      if (result.success) {
        toast.success(`✅ Productos importados correctamente.`);
      } else {
        toast.error("❌ Error al importar productos.");
      }

      setCsvFile(null); // Resetear archivo CSV seleccionado

      if (csvInputRef.current) {
        csvInputRef.current.value = null; // Resetear input de archivo visualmente
      }

    } catch (error) {
      console.error("Error al importar CSV:", error);
      toast.error("❌ Error inesperado al importar productos.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8C6D6] p-4 sm:p-8">
      {/* Header con título y filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl text-[#B94F6F] font-bold">Productos</h2>

        {/* Selectores de filtros para categoría y artista */}
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
          {/* Selector de categoría */}
          <select
            className="border rounded px-2 py-1 w-full sm:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Selector de artista */}
          <select
            className="border rounded px-2 py-1 w-full sm:w-auto"
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
          >
            <option value="">Todos los artistas</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>

          {/* Opciones exclusivas para administrador */}
          {isAdmin && (
            <>
              {/* Botón para crear nuevo producto */}
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 w-full sm:w-auto"
              >
                Crear nuevo producto
              </button>

              {/* Input para cargar archivo CSV */}
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="border rounded px-2 py-1 w-full sm:w-auto"
              />

              {/* Botón para importar productos desde CSV */}
              <button
                onClick={handleImportCsv}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full sm:w-auto"
              >
                Importar desde CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* Spinner de carga mientras se obtienen productos */}
      {loading && (
        <LoadingSpinner className="flex justify-center items-center h-64" />
      )}

      {/* Grid que muestra los productos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, images: product.images || [] }}
              onEdit={() => handleEdit(product)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          // Mensaje si no hay productos con filtros activos
          (selectedCategory || selectedArtist) && (
            <p className="col-span-full text-center text-gray-600 mt-8">
              No hay productos disponibles con esas especificaciones.
            </p>
          )
        )}
      </div>

      {/* Modal para crear o editar productos */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ProductForm
          categories={categories}
          artists={artists}
          initialData={productToEdit || {}}
          isEditMode={!!productToEdit}
          onProductCreated={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Product;
