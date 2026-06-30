import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function KitchenOrders() {
  const { get, put } = useApi();
  const { t } = useTranslation("common");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const getNextStatus = (current) => {
    if (current === "New Order") return "Preparing";
    if (current === "Preparing") return "Ready";
    if (current === "Ready") return "Preparing";
    return "New Order";
  };

  const updateOrderStatus = async (order) => {
    if (!order || updatingStatus) return;

    const nextStatus = getNextStatus(order.status);
    if (nextStatus === order.status) return;

    setUpdatingStatus(true);

    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o._id === order._id || o.id === order._id
          ? { ...o, status: nextStatus }
          : o
      )
    );

    setSelectedOrder((prev) =>
      prev && (prev._id === order._id || prev.id === order._id)
        ? { ...prev, status: nextStatus }
        : prev
    );

    try {
      const orderId = order._id ?? order.id;
      await put(`/api/v1/orders/status/${orderId}`, { status: nextStatus });
    } catch (error) {
      console.error("Failed to update order status:", error);

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id || o.id === order._id
            ? { ...o, status: order.status }
            : o
        )
      );

      setSelectedOrder((prev) =>
        prev && (prev._id === order._id || prev.id === order._id)
          ? { ...prev, status: order.status }
          : prev
      );

      toast.error(t("CouldNotUpdateOrderStatus"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteOrder = async (order) => {
    if (!order) return;
    try {
      const orderId = order._id ?? order.id;
      await put(`/api/v1/orders/kitchen/dismiss/${orderId}`);

      setOrders((prevOrders) =>
        prevOrders.filter((o) => (o._id ?? o.id) !== orderId)
      );

      setShowModal(false);
      setSelectedOrder(null);

      toast.success(t("OrderDeletedSuccessfully"));
    } catch (error) {
      console.error("Failed to dismiss order:", error);
      toast.error(t("FailedToDeleteOrder"));
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
      const res = await get("/api/v1/orders/kitchen");

   
      const normalizedOrders = (res.data.data || []).map((o) => {
        let status = o.status;

        if (
          !status ||
          status.toLowerCase() === "pending" ||
          status.toLowerCase() === "panding"
        ) {
          status = "New Order";
        }

        return {
          ...o,
          status,
        };
      });

      setOrders(normalizedOrders);
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
    <div>
      {loading ? (
        <div className="text-center text-slate-500 py-8">{t("LoadingOrders")}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-slate-500 py-8">{t("NoOrdersAvailable")}</div>
      ) : (
        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th>{t("OrderNumber")}</th>
                <th>{t("TableNumber")}</th>
                <th>{t("OrderDate")}</th>
                <th>{t("OrderState")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const orderId = order._id ?? order.id;
                const tableNumber = order.tableId?.tableNumber ?? "-";
                return (
                  <tr
                    key={orderId}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(order)}
                  >
                    <td>{index + 1}</td>
                    <td>{tableNumber}</td>
                    <td>{formatOrderTime(order.createdAt)}</td>
                    <td>
                      <span className={`erp-badge ${
                        order.status === "Ready" ? "erp-badge-success"
                          : order.status === "Preparing" ? "erp-badge-warning"
                          : order.status === "New Order" ? "erp-badge-info"
                          : "erp-badge-neutral"
                      }`}>
                        {t(order.status === "New Order" ? "NewOrder" : order.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {showModal && selectedOrder && (
            <div className="modal-backdrop" onClick={closeModal}>
              <div className="modal-card modal-card-md p-6 w-full" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={closeModal}>✕</button>
                <h3 className="erp-page-title mb-4">{t("OrderDetails")}</h3>

                <div className="flex-1 overflow-y-auto max-h-96">
                  <p className="text-gray-700 mb-2">
                    <strong>{t("OrderNumber")}:</strong>{" "}
                    {orders.findIndex(
                      (o) =>
                        (o._id ?? o.id) ===
                        (selectedOrder._id ?? selectedOrder.id)
                    ) + 1}
                  </p>

                  <p className="text-gray-700 mb-2">
                    <strong>{t("TableNumber")}:</strong>{" "}
                    {selectedOrder.tableId?.tableNumber ?? "-"}
                  </p>

                  <p className="text-gray-700 mb-2">
                    <strong>{t("OrderDate")}:</strong>{" "}
                    {formatOrderTime(selectedOrder.createdAt)}
                  </p>

                  <p className="text-gray-700 mb-2">
                    <strong>{t("OrderState")}:</strong>{" "}
                    {t(
                      selectedOrder.status === "New Order"
                        ? "NewOrder"
                        : selectedOrder.status
                    )}
                  </p>

                  <div className="text-gray-700 mb-2">
                    <strong>{t("Items")}:</strong>
                    {selectedOrder.items && selectedOrder.items.length ? (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {selectedOrder.items.map((item) => (
                          <li key={item.foodId?._id || item.foodId}>
                            {item.foodId?.name || "Item"} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-2">{t("NoItemsAvailable")}</div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-2">
                    <strong>{t("TotalAmount")}:</strong>{" "}
                    {selectedOrder.totalAmount ?? 0}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => updateOrderStatus(selectedOrder)}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? t("LoadingOrders") : t("ToggleStatus")}
                  </button>

                  {selectedOrder.status === "Ready" && (
                    <button className="btn-danger" onClick={() => deleteOrder(selectedOrder)}>
                      {t("DeleteOrder")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KitchenOrders;