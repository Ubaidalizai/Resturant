import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { toast } from "react-toastify";

function KitchenOrders() {
  const { get, put } = useApi();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ORDER_STATUS_SEQUENCE = ["Preparing", "Ready"];
  const getNextStatus = (current) => {
    if (current === "new order") return "Preparing";
    if (current === "Preparing") return "Ready";
    if (current === "Ready") return "Preparing";
  };

  const updateOrderStatus = async (order) => {
    if (!order) return;
    const nextStatus = getNextStatus(order.status);
    if (nextStatus === order.status) return;

    // Update state locally first for immediate UI feedback
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o._id === order._id || o.id === order._id ? { ...o, status: nextStatus } : o
      )
    );
    setSelectedOrder((prev) =>
      prev && (prev._id === order._id || prev.id === order._id) ? { ...prev, status: nextStatus } : prev
    );

    try {
      const orderId = order._id ?? order.id;
      await put(`/api/v1/orders/status/${orderId}`, { status: nextStatus });
      // If API succeeds, state is already updated
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Revert the local state change on failure
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id || o.id === order._id ? { ...o, status: order.status } : o
        )
      );
      setSelectedOrder((prev) =>
        prev && (prev._id === order._id || prev.id === order._id) ? { ...prev, status: order.status } : prev
      );
      toast.error("Could not update order status. Please try again.");
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await get("/api/v1/orders/all");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const formatOrderTime = (isoTime) => {
    const date = new Date(isoTime);
    return isNaN(date) ? isoTime : date.toLocaleString();
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
        Kitchen Orders
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order #</th>
                <th className="p-3">Table #</th>
                <th className="p-3">Order Time</th>
                <th className="p-3">Order State</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const orderId = order._id ?? order.id;
                const tableNumber = order.tableId?.tableNumber ?? "-";
                return (
                  <tr
                    key={orderId}
                    className="border-b hover:bg-yellow-50 cursor-pointer"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{tableNumber}</td>
                    <td className="p-3">{formatOrderTime(order.createdAt)}</td>
                    <td
                      className={`p-3 font-semibold ${
                        order.status === "Ready"
                          ? "text-green-600"
                          : order.status === "Preparing"
                          ? "text-orange-500"
                          : order.status === "New Order"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {order.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {showModal && selectedOrder && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close X Button */}
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
                  onClick={closeModal}
                >
                  ✕
                </button>

                <h3 className="text-2xl font-bold mb-4 text-center">
                  Order Details
                </h3>
                <div className="flex-1 overflow-y-auto max-h-96">
                  <p className="text-gray-700 mb-2">
                    <strong>Order #:</strong> {orders.findIndex(o => (o._id ?? o.id) === (selectedOrder._id ?? selectedOrder.id)) + 1}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Table number:</strong> {selectedOrder.tableId?.tableNumber ?? "-"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Order date:</strong> {formatOrderTime(selectedOrder.createdAt)}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Order state:</strong> {selectedOrder.status}
                  </p>
                  <div className="text-gray-700 mb-2">
                    <strong>Items:</strong>
                    {selectedOrder.items && selectedOrder.items.length ? (
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                        {selectedOrder.items.map((item) => (
                          <li key={item.foodId?._id || item.foodId}>
                            {item.foodId?.name || "Item"} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-2">No items available</div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Total amount:</strong> {selectedOrder.totalAmount ?? 0}
                  </p>
                </div>
                <button
                  className="mt-4 self-center bg-yellow-600 text-white py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors"
                  onClick={() => updateOrderStatus(selectedOrder)}
                >
                  Toggle Status
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KitchenOrders;