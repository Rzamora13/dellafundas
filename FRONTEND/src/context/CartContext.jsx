import React, { createContext, useState, useEffect, useContext } from "react";
import { cartAPI } from "../services/api";

const CartContext = createContext();

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  // Estado para almacenar los productos del carrito
  const [cartItems, setCartItems] = useState([]);
  // Estado para manejar el estado de carga del carrito
  const [loading, setLoading] = useState(false);

  // Al montar el componente o cuando cambia el userId, carga el carrito desde la API
  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    // Función interna para obtener el carrito del usuario
    const fetchCart = async () => {
      setLoading(true);
      try {
        const data = await cartAPI.get(userId);
        setCartItems(data || []);
      } catch (error) {
        console.error("Error al cargar carrito:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  // Agrega un producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    if (!userId) return;
    try {
      await cartAPI.add(userId, productId, quantity);
      const data = await cartAPI.get(userId);
      setCartItems(data || []);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  // Actualiza la cantidad de un producto del carrito
  const updateQuantity = async (cartProductId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.update(cartProductId, quantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.cart_product_id === cartProductId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  // Elimina un producto del carrito
  const removeFromCart = async (cartProductId) => {
    try {
      await cartAPI.remove(cartProductId);
      setCartItems((prev) =>
        prev.filter((item) => item.cart_product_id !== cartProductId)
      );
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  };

  // Vacía completamente el carrito del usuario
  const clearCart = async () => {
    if (!userId) return;
    try {
      await cartAPI.clear(userId);
      setCartItems([]);
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    }
  };

  // Calcula el total del carrito
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product?.price || 0);
      return total + price * item.quantity;
    }, 0);
  };

  // Proporciona los valores y funciones del contexto a los componentes hijos
  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getTotalPrice, loading, }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito desde cualquier componente
export const useCart = () => useContext(CartContext);
