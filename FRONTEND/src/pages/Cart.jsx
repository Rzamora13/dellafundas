import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, loading } = useCart();
  const { createOrder, fetchUserOrders } = useOrders();
  const { user } = useAuth();

  // Estado para mostrar/ocultar el modal de "vaciar carrito"
  const [showClearModal, setShowClearModal] = useState(false);

  // Muestra spinner si se está cargando
  if (!user) return <div>Cargando...</div>;
  
  if (loading)
    return <LoadingSpinner className="flex justify-center items-center h-64" />;

  // Si el carrito está vacío, muestra un mensaje
  if (!cartItems || cartItems.length === 0)
    return (
      <div className="p-8 w-full h-full flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Tu carrito está vacío</h2>
      </div>
    );

  const total = getTotalPrice();
  // Si el valor es valido, lo formatea a dos decimales si no, muestra "0.00"
  const safeTotal = Number.isFinite(total) ? total.toFixed(2) : "0.00";

  // Función para procesar la compra
  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      toast.warn("El carrito está vacío");
      return;
    }

    try {
      const response = await createOrder(cartItems); // Crea pedido
      await fetchUserOrders();                       // Recarga pedidos del usuario
      clearCart();                                   // Vacía carrito
      toast.success(response.message || "Compra realizada con éxito");
    } catch (error) {
      toast.error(error.message || "Error al realizar la compra");
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Carrito de Compras</h1>

      {/* Tabla de productos para pantallas grandes */}
      <div className="hidden md:block">
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Producto</th>
              <th className="text-left p-2">Precio unitario</th>
              <th className="text-center p-2">Cantidad</th>
              <th className="text-right p-2">Subtotal</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(({ cart_product_id, product, quantity }) => (
              <tr key={cart_product_id} className="border-b">
                <td className="p-2">{product?.name || "Producto"}</td>
                <td className="p-2">{Number(product?.price || 0).toFixed(2)}€</td>
                <td className="p-2 text-center">
                  {/* Controles para cantidad */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(cart_product_id, Math.max(1, quantity - 1))
                      }
                      className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      readOnly
                      min="1"
                      value={quantity}
                      className="w-16 text-center border rounded px-1"
                    />
                    <button
                      onClick={() => {
                        if (quantity < product.stock) {
                          updateQuantity(cart_product_id, quantity + 1);
                        } else {
                          toast.info(`No puedes añadir más de ${product.stock} unidades de "${product.name}"`);
                        }
                      }}
                      className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-2 text-right">
                  {(Number(product?.price || 0) * quantity).toFixed(2)}€
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => {
                      removeFromCart(cart_product_id);
                      toast.info(`"${product.name}" eliminado del carrito`);
                    }}
                    className="text-[#E63946] hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista responsive para móviles (cards) */}
      <div className="md:hidden flex flex-col gap-4 mb-6">
        {cartItems.map(({ cart_product_id, product, quantity }) => (
          <div key={cart_product_id} className="border rounded-lg p-4 shadow-sm flex flex-col gap-2">
            <div className="text-lg font-semibold">{product?.name || "Producto"}</div>
            <div className="text-sm">Precio unitario: {Number(product?.price || 0).toFixed(2)}€</div>
            <div className="text-sm">Subtotal: {(Number(product?.price || 0) * quantity).toFixed(2)}€</div>
            <div className="flex items-center gap-2">
              {/* Controles de cantidad para móvil */}
              <button
                onClick={() =>
                  updateQuantity(cart_product_id, Math.max(1, quantity - 1))
                }
                className="bg-gray-200 px-2 rounded hover:bg-gray-300"
              >
                −
              </button>
              <input
                type="number"
                readOnly
                min="1"
                value={quantity}
                className="w-16 text-center border rounded px-1"
              />
              <button
                onClick={() => {
                  if (quantity < product.stock) {
                    updateQuantity(cart_product_id, quantity + 1);
                  } else {
                    toast.info(`No puedes añadir más de ${product.stock} unidades de "${product.name}"`);
                  }
                }}
                className="bg-gray-200 px-2 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                removeFromCart(cart_product_id);
                toast.info(`"${product.name}" eliminado del carrito`);
              }}
              className="text-[#E63946] hover:text-red-800 text-sm self-end"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Botones y total */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => setShowClearModal(true)}
          className="bg-[#E63946] text-white px-4 py-2 rounded hover:bg-red-800 w-full sm:w-auto"
        >
          Vaciar carrito
        </button>

        <button
          onClick={handlePurchase}
          className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
        >
          Comprar
        </button>

        <div className="text-xl font-semibold w-full sm:w-auto text-right">
          Total: {safeTotal}€
        </div>
      </div>

      {/* Modal de confirmación para vaciar carrito */}
      <Modal
        title="Vaciar carrito"
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
      >
        <p className="mb-4">¿Estás seguro de que quieres vaciar el carrito?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowClearModal(false)}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              clearCart();
              setShowClearModal(false);
              toast.success("Carrito vaciado");
            }}
            className="px-4 py-2 rounded bg-[#E63946] text-white hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
