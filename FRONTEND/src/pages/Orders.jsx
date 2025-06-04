import React, { useEffect, useState } from "react";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const Orders = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // Desestructuramos el contexto de órdenes, obteniendo datos, funciones y estados
  const { orders, allOrders, loading, error, fetchUserOrders, fetchAllOrders, updateOrderStatus } = useOrders();

  // Estado para el filtro de búsqueda por ID
  const [searchId, setSearchId] = useState("");
  // Estado para filtrar por estado de la orden
  const [statusFilter, setStatusFilter] = useState("");

  
  // useEffect para cargar órdenes según el tipo de usuario (admin o usuario normal)
  useEffect(() => {
    if (isAdmin) {
      fetchAllOrders();
    } else {
      fetchUserOrders();
    }
  }, [isAdmin]);

  // Filtrar las órdenes para mostrar según los filtros de búsqueda y estado
  const ordersToShow = (isAdmin ? allOrders : orders)
    .filter(order =>
      searchId ? order.id.toString().includes(searchId) : true
    )
    .filter(order =>
      statusFilter ? order.status.toLowerCase() === statusFilter.toLowerCase() : true
    );

  // Maneja el cambio de estado de una orden (solo admin puede cambiarlo)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Pedido #${orderId} actualizado a "${newStatus}"`);

      // Refrescar las órdenes después del cambio según el rol
      if (isAdmin) {
        fetchAllOrders();
      } else {
        fetchUserOrders();
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner className="flex justify-center items-center h-64"/>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="w-full bg-[#EBBDCA] py-6 px-4">
      <div className="max-w-screen-lg mx-auto">
        {/* Título cambia según si es admin o usuario */}
        <h1 className="text-2xl text-[#B94F6F] font-bold mb-6 text-center sm:text-left">
          {isAdmin ? "Todos los Pedidos" : "Mis Pedidos"}
        </h1>

        {/* Filtros visibles solo para admin */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            {/* Input para buscar por ID */}
            <input
              type="text"
              placeholder="Buscar por ID"
              className="border rounded px-3 py-1 w-full sm:w-auto"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            {/* Select para filtrar por estado */}
            <select
              className="border rounded px-3 py-1 w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">pendiente</option>
              <option value="en_camino">en_camino</option>
              <option value="entregado">entregado</option>
            </select>
          </div>
        )}

        {/* Si no hay órdenes que mostrar con los filtros */}
        {ordersToShow.length === 0 ? (
          <div className="text-center text-gray-600">
            No se encontraron pedidos con los filtros aplicados.
          </div>
        ) : (
          // Listado de órdenes filtradas
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {ordersToShow.map((order) => (
              <div
                key={order.id}
                className="w-full sm:w-[300px] bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="mb-4 text-sm text-gray-700 space-y-2">
                  {/* Mostrar ID de pedido y estado o selector para admin */}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span><strong>Pedido ID:</strong> {order.id}</span>
                    {isAdmin ? (
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={order.status === "entregado"} // No puede cambiar si ya está entregado
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="en_camino">en_camino</option>
                        <option value="entregado">entregado</option>
                      </select>
                    ) : (
                      <span><strong>Estado:</strong> {order.status}</span>
                    )}
                  </div>

                  {/* Fecha de creación formateada */}
                  <div className="text-xs text-gray-500">
                    <strong>Fecha:</strong>{" "}
                    {new Date(order.created_at.replace(" ", "T")).toLocaleString("es-ES")}
                  </div>

                  {/* Mostrar usuario si es admin */}
                  {isAdmin && order.user && (
                    <div>
                      <strong>Usuario:</strong> {order.user.email}
                    </div>
                  )}
                </div>

                {/* Listado de productos con cantidad y precio */}
                <div className="border-t border-gray-200 pt-3">
                  {order.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span>{product.name} x {product.quantity}</span>
                      <span>{(product.price * product.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                {/* Total del pedido */}
                <div className="text-right font-semibold mt-3 text-[#B94F6F]">
                  Total: {Number(order.total).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
