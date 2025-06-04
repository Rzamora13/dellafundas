import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useProducts } from "../context/ProductContext"; 
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetail = () => {
  const { id } = useParams(); // Obtener el id del producto desde la URL
  const navigate = useNavigate();
  const { getProductById } = useProducts();

  const [product, setProduct] = useState(null); // Estado para almacenar el producto
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para índice de imagen mostrada

  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProductById(id);
      setProduct(result);
    };
    fetchProduct();
  }, [id, getProductById]);

  if (!product) return <LoadingSpinner className="flex justify-center items-center h-64"/>;

  // Construir URL base para las imágenes, usando variables de entorno
  const baseURL = `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_PORT}`;

  // Lista con rutas completas de imágenes del producto o imagen por defecto
  const images = product.images?.length > 0
    ? product.images.map(img => `${baseURL}${img.path}`)
    : ["/images/default.png"];

  // Función para mostrar la siguiente imagen en el slider (ciclo circular)
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Función para mostrar la imagen anterior en el slider (ciclo circular)
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 bg-[#F8C6D6] text-[#B94F6F]">
      {/* Botón para volver a la página anterior */}
      <button
        onClick={() => navigate(-1)}
        className="bg-[#B94F6F] text-white px-4 py-2 rounded-full mb-6 hover:bg-[#A84360] transition"
      >
        ← Volver
      </button>

      {/* Contenedor principal del detalle del producto */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-screen-lg mx-auto">
        {/* Nombre del producto */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#B94F6F]">{product.name}</h1>

        {/* Slider de imágenes del producto */}
        <div className="relative w-full max-w-md mx-auto h-[250px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-300 mb-6">
          {/* Imagen actual del slider */}
          <img
            src={images[currentImageIndex]}
            alt={`${product.name} imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-contain bg-white"
          />
          {/* Botones de navegación solo si hay más de una imagen */}
          {images.length > 1 && (
            <>
              {/* Botón para imagen anterior */}
              <button
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#B94F6F] text-white px-2 sm:px-3 py-1 rounded-r hover:bg-[#FF4F78] transition"
                aria-label="Imagen anterior"
              >
                ←
              </button>
              {/* Botón para imagen siguiente */}
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#B94F6F] text-white px-2 sm:px-3 py-1 rounded-l hover:bg-[#FF4F78] transition"
                aria-label="Imagen siguiente"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Precio del producto */}
        <p className="text-xl sm:text-2xl font-semibold mb-3">Precio: {product.price}€</p>

        {/* Mostrar categoría solo si existe */}
        {product.category && (
          <p className="text-base sm:text-lg mb-2">
            Categoría: <span className="font-medium">{product.category.name || product.category}</span>
          </p>
        )}

        {/* Mostrar artista solo si existe */}
        {product.artist && (
          <p className="text-base sm:text-lg">
            Artista: <span className="font-medium">{product.artist.name || product.artist}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
