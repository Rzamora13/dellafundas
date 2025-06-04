import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { products, loading: loadingProducts } = useProducts();
  const { categories, loading: loadingCategories } = useCategories();

  // Estado local para controlar desde qué índice mostrar los productos en el carrusel
  const [startIndex, setStartIndex] = useState(0);
  // Cantidad de productos visibles a la vez en el carrusel
  const visibleCount = 4;

  // Construcción de la URL base para las imágenes usando variables de entorno
  const baseURL = `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_PORT}`;

  // Mostrar spinner de carga mientras se cargan productos o categorías
  if (loadingProducts || loadingCategories) {
    return (
      <LoadingSpinner className="flex justify-center items-center h-64"/>
    );
  }

  // Crear una lista con objetos que contienen categoría y un producto que pertenezca a esa categoría
  const productsByCategory = categories
    .map((category) => {
      // Buscar un producto que tenga la categoría actual
      const product = products.find(p => p.category?.id === category.id);
      // Devolver el objeto solo si hay un producto asociado, si no null
      return product ? { category, product } : null;
    })
    .filter(Boolean); // Eliminar los null (categorías sin productos)

  const total = productsByCategory.length; // Número total de categorías con productos

  // Si no hay productos disponibles, mostrar mensaje
  if (total === 0) {
    return (
      <main className="flex flex-col items-center text-center flex-grow pb-10 bg-[#EBBDCA]">
        <h1 className="text-xl font-semibold mt-10">No products available.</h1>
      </main>
    );
  }

  // Función para avanzar al siguiente grupo de productos (carrusel)
  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % total);
  };

  // Función para retroceder al grupo anterior de productos
  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + total) % total);
  };

  // Construir lista con los productos visibles en el carrusel según startIndex y visibleCount
  const visibleProducts = [];
  for (let i = 0; i < visibleCount; i++) {
    // Se suma i al indice de inicio para obtener el índice del producto a mostrar
    // Se usa el operador módulo para que el índice vuelva al inicio si supera el total
    const index = (startIndex + i) % total;
    visibleProducts.push(productsByCategory[index]);
  }

  return (
    <main className="flex flex-col items-center text-center flex-grow pb-10 bg-[#EBBDCA] px-4">
      {/* Contenedor principal del carrusel con botones para navegar */}
      <div className="flex items-center justify-between mt-10 w-full max-w-7xl">
        {/* Botón para ir al producto anterior */}
        <button className="text-3xl px-2 sm:px-4" onClick={handlePrev}>
          &#x276E;
        </button>

        {/* Contenedor de productos visibles */}
        <div className="flex flex-wrap justify-center gap-4 w-full mx-2">
          {visibleProducts.map(({ category, product }, idx) => {
            // Construir URL de la imagen si existe, sino usar imagen por defecto
            const imageUrl = product.images?.[0]
              ? `${baseURL}${product.images[0].path}`
              : "/images/default.png";

            return (
              // Link que redirige a la página de productos filtrados por categoría
              <Link
                key={`${category.id}-${idx}`}
                to={`/products?category=${category.id}`}
                className="w-full xs:w-[260px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[400px] bg-white border-4 border-black flex flex-col items-center justify-between p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                {/* Contenedor de la imagen */}
                <div className="w-full h-64 border border-black rounded flex items-center justify-center bg-white">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {/* Nombre y precio del producto */}
                <div className="mt-2 text-center">
                  <p className="text-lg font-bold">{product.name}</p>
                  <p className="text-sm">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Botón para ir al siguiente producto */}
        <button className="text-3xl px-2 sm:px-4" onClick={handleNext}>
          &#x276F;
        </button>
      </div>

      {/* Link para ir a la página con todos los productos */}
      <Link
        to={"/products"}
        className="mt-6 px-6 py-2 bg-[#FF4F78] text-white rounded-full border border-black hover:bg-[#D6406D]"
      >
        See all products
      </Link>
    </main>
  );
};

export default Home;
