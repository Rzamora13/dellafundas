import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { toast } from "react-toastify";

const ProductForm = ({ onProductCreated, categories, artists, initialData = {}, isEditMode = false, error: externalError = null, }) => {
  const { createProduct, updateProduct } = useProducts();

  // Estados para los campos del formulario
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [artistId, setArtistId] = useState("");
  const [images, setImages] = useState([]);

  // Cuando cambian los datos iniciales, se actualizan los estados para rellenar el formulario (modo edición)
  useEffect(() => {
    setProductName(initialData.name || "");
    setProductDescription(initialData.description || "");
    setProductPrice(initialData.price || "");
    setProductStock(initialData.stock || "");
    setCategoryId(initialData.categoryId || initialData.category?.id || "");
    setArtistId(initialData.artistId || initialData.artist?.id || "");
    setImages([]);  // Resetea las imágenes al cambiar initialData
  }, [initialData]);

  // Captura los archivos seleccionados en el input tipo file y los guarda en estado como array
  const handleFileChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  // Maneja el submit del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construye el objeto con los datos del producto a enviar
    const productData = {
      name: productName,
      description: productDescription,
      price: productPrice,
      stock: productStock,
      categoryId,
      artistId,
      images,
    };

    let success = false;

    // Si está en modo edición, actualiza producto, sino crea uno nuevo
    if (isEditMode) {
      success = await updateProduct(initialData.id, productData);
    } else {
      success = await createProduct(productData);
    }

    // Si la operación fue exitosa muestra toast de éxito y ejecuta callback
    if (success) {
      toast.success(isEditMode ? "Producto actualizado correctamente." : "Nuevo producto añadido.");
      if (onProductCreated) onProductCreated();
    } else {
      // Si falla, muestra error (externo si existe o mensaje por defecto)
      toast.error(externalError || "Ocurrió un error al guardar el producto.");
    }
  };

  // Busca la categoría y artista seleccionados para mostrar un texto con el nombre
  const selectedCategory = categories?.find((c) => c.id === categoryId);
  const selectedArtist = artists?.find((a) => a.id === artistId);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-md shadow-md max-w-full sm:max-w-md mx-auto space-y-4 text-sm"
    >
      {/* Título cambia según si se edita o crea producto */}
      <h3 className="text-lg font-semibold mb-3 text-[#FF4F78] text-center">
        {isEditMode ? "Editar Producto" : "Crear Producto"}
      </h3>

      {/* Campo nombre del producto */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full px-2 py-1 border border-gray-300 rounded"
        />
      </div>

      {/* Campo descripción del producto */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
          rows={3}
          className="w-full px-2 py-1 border border-gray-300 rounded resize-none"
        />
      </div>

      {/* Precio y stock en fila en pantallas mayores, columna en móviles */}
      <div className="flex flex-col sm:flex-row sm:space-x-3">
        <div className="flex-1 mb-3 sm:mb-0">
          <label className="block mb-1 font-medium text-gray-700">Precio</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            required
            min="1"
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Selector de categoría */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Categoría</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Seleccionar categoría</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {/* Muestra categoría seleccionada */}
        {selectedCategory && (
          <p className="mt-1 text-xs text-pink-600 font-semibold">
            Seleccionado: {selectedCategory.name}
          </p>
        )}
      </div>

      {/* Selector de artista */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Artista</label>
        <select
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          required
          className="w-full px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Seleccionar artista</option>
          {artists?.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        {/* Muestra artista seleccionado */}
        {selectedArtist && (
          <p className="mt-1 text-xs text-pink-600 font-semibold">
            Seleccionado: {selectedArtist.name}
          </p>
        )}
      </div>

      {/* Input para subir imágenes (múltiples) */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Imágenes</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm"
        />
        {/* Muestra cantidad de imágenes seleccionadas */}
        {images.length > 0 && (
          <p className="mt-1 text-xs text-gray-600">
            {images.length} imagen(es) seleccionada(s)
          </p>
        )}
      </div>

      {/* Botón para enviar formulario con texto según modo */}
      <button
        type="submit"
        className="w-full bg-[#FF4F78] text-white py-2 rounded hover:bg-[#D6406D] transition text-sm"
      >
        {isEditMode ? "Actualizar Producto" : "Crear Producto"}
      </button>
    </form>
  );
};

export default ProductForm;
