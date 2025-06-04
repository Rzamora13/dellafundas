import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Modal from "./Modal";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Estado para cantidad de producto a añadir al carrito (inicia en 1)
  const [quantity, setQuantity] = useState(1);
  // Estado para controlar si se muestra el modal de confirmación para eliminar
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Función para añadir producto al carrito
  const handleAddToCart = (e) => {
    e.stopPropagation();  // Evita que el clic afecte a otros elementos padres
    e.preventDefault();

    if (!user) {
      toast.warn("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    if (quantity > product.stock) {
      toast.info(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    if (user.roles?.includes("ROLE_USER")) {
      addToCart(product.id, quantity);
      toast.success("Producto añadido al carrito");
    }
  };

  // Maneja la edición del producto (solo admins)
  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) {
      onEdit(product);  // Ejecuta callback de edición con el producto
    }
  };

  // Abre el modal de confirmación para eliminar producto
  const openConfirmModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Cierra el modal de confirmación
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // Confirma eliminación y ejecuta callback, cierra modal
  const confirmDelete = () => {
    if (onDelete) onDelete(product.id);
    setShowConfirmModal(false);
    toast.success("Producto eliminado correctamente");
  };

  // Construye la URL base usando variables de entorno para las imágenes
  const baseURL = `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_PORT}`;
  // Si el producto tiene imágenes, usa la primera, si no usa imagen por defecto
  const imageUrl =
    product.images?.length > 0
      ? `${baseURL}${product.images[0].path}`
      : "/images/default.png";

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <>
      {/* Enlace que envuelve toda la tarjeta para ir a detalles del producto */}
      <Link
        to={`/products/${product.id}`}
        className="bg-[#B94F6F] rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col"
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* Imagen del producto */}
        <div className="flex justify-center p-4 border-b border-[#890E34]">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-48 w-auto object-contain rounded-md"
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        {/* Contenido de la tarjeta: nombre, descripción, precio y stock */}
        <div className="flex flex-col flex-grow p-4 text-white">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm mb-2 line-clamp-3">{product.description}</p>
          <p className="font-bold text-base mb-1">{product.price}€</p>
          <p className="text-sm mb-4">Stock: {product.stock}</p>

          {isAdmin ? (
            // Si es admin, muestra botones para editar y eliminar producto
            <div
              className="mt-auto flex flex-col sm:flex-row justify-between gap-2"
              onClick={(e) => e.stopPropagation()} // Evita que clics en este div propaguen y naveguen al detalle
            >
              <button
                onClick={handleEdit}
                className="flex-1 bg-[#3A86FF] text-white rounded-md py-1 text-sm hover:bg-blue-700 transition"
                aria-label={`Editar ${product.name}`}
              >
                Editar
              </button>
              <button
                onClick={openConfirmModal}
                className="flex-1 bg-[#E63946] text-white rounded-md py-1 text-sm hover:bg-red-700 transition"
                aria-label={`Eliminar ${product.name}`}
              >
                Eliminar
              </button>
            </div>
          ) : (
            // Si no es admin, muestra controles para cantidad y botón para añadir al carrito
            <div className="mt-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                {/* Botón para disminuir cantidad */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity((prev) => Math.max(1, prev - 1));
                  }}
                  className="bg-white hover:bg-gray-200 text-[#B94F6F] rounded px-2 select-none"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                {/* Input que muestra la cantidad actual (solo lectura) */}
                <input
                  type="number"
                  readOnly
                  value={quantity}
                  className="w-12 text-center border border-white rounded bg-[#F9D1DA] cursor-default text-[#B94F6F] font-semibold"
                  aria-label="Cantidad"
                />

                {/* Botón para aumentar cantidad */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity((prev) =>
                      prev < product.stock ? prev + 1 : prev
                    );
                  }}
                  className="bg-white hover:bg-gray-200 text-[#B94F6F] rounded px-2 select-none"
                  aria-label="Incrementar cantidad"
                >
                  +
                </button>
              </div>

              {/* Botón para añadir al carrito */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#FF4F78] text-white rounded-md py-2 font-semibold hover:bg-[#D6406D] transition"
                aria-label={`Añadir ${product.name} al carrito`}
              >
                Añadir al carrito
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Modal de confirmación para eliminar producto */}
      <Modal
        title="Confirmar eliminación"
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
      >
        <p>¿Estás seguro de que quieres eliminar este producto?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeConfirmModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
