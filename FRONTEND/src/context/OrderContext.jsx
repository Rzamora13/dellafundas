import { createContext, useState, useEffect, useContext } from 'react';
import { orderAPI } from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Estado para guardar los pedidos del usuario autenticado
  const [orders, setOrders] = useState([]);

  // Estado para guardar todos los pedidos (solo visible por administradores)
  const [allOrders, setAllOrders] = useState([]);

  // Estado para indicar si hay una operación en curso
  const [loading, setLoading] = useState(false);

  // Estado para manejar errores globales en las operaciones
  const [error, setError] = useState(null);

  // Obtiene el usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const userRoles = user?.roles || [];

  const isAdmin = userRoles.includes('ROLE_ADMIN');

  // Función para obtener los pedidos del usuario actual
  const fetchUserOrders = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.get(userId);
      setOrders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener todos los pedidos (solo para admins)
  const fetchAllOrders = async () => {
    if (!isAdmin) {
      setError('No autorizado para ver todos los pedidos');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getAll();
      setAllOrders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo pedido
  const createOrder = async (data) => {
    if (!userId) {
      const errorMsg = 'Usuario no autenticado';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    setLoading(true);
    setError(null);
    try {
      const response = await orderAPI.create(userId, data);
      await fetchUserOrders();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de un pedido (solo admins)
  const updateOrderStatus = async (orderId, status) => {
    if (!isAdmin) {
      setError('No autorizado para actualizar estado de pedidos');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await orderAPI.updateStatus(orderId, status);
      await fetchAllOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Al montar el componente, carga los pedidos del usuario actual
  useEffect(() => {
    fetchUserOrders();
  }, [userId]);

  // Proporciona valores y funciones a los componentes hijos
  return (
    <OrderContext.Provider
      value={{ orders, allOrders, loading, error, fetchUserOrders, fetchAllOrders, createOrder, updateOrderStatus, }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto
export const useOrders = () => useContext(OrderContext);
