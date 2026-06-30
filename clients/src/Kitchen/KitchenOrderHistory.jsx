import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { toast } from "react-toastify";
import { useTranslation } from "../../node_modules/react-i18next";

function KitchenOrderHistory() {
  const { get, put } = useApi();
  const { t } = useTranslation("common");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await get("/api/v1/orders/kitchen/history");
      const normalizedOrders = (res.data.data || []).map((o) => {
        let status = o.status;
        if (
          !status ||
          status.toLowerCase() === "pending" ||
          status.toLowerCase() === "panding"
        ) {
          status = "New Order";
        }
        return { ...o, status };
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
    fetchHistory();
  }, []);

  const deleteFromHistory = async (order) => {
    if (!order) return;
    try {
      const orderId = order._id ?? order.id;
      await put(`/api/v1/orders/kitchen/history-hide/${orderId}`);
      setOrders((prev) => prev.filter((o) => (o._id ?? o.id) !== orderId));
      setShowModal(false);
      setSelectedOrder(null);
      toast.success(t("OrderDeletedSuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("FailedToDeleteOrder"));
    }
  };

  const formatOrderTime = (isoTime) => {
    const date = new Date(isoTime);
    return isNaN(date) ? isoTime : date.toLocaleString();
  };

  return (
    <div>
      {loading ? (
        <div className="text-center text-slate-500 py-8">{t("LoadingOrders")}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-slate-500 py-8">{t("NoOrdersFound")}</div>
      ) : (
        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th>{t("OrderNumber")}</th>
                <th>{t("TableNumber")}</th>
                <th>{t("OrderDate")}</th>
                <th>{t("OrderState")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const orderId = order._id ?? order.id;
                return (
                  <tr key={orderId}>
                    <td>{index + 1}</td>
                    <td>{order.tableId?.tableNumber ?? "-"}</td>
                    <td>{formatOrderTime(order.createdAt)}</td>
                    <td>
                      <span className="erp-badge erp-badge-neutral">
                        {t(order.status === "New Order" ? "NewOrder" : order.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-blue-700 text-sm hover:underline mr-3"
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                      >
                        {t("View", { defaultValue: "View" })}
                      </button>
                      <button
                        type="button"
                        className="text-red-600 text-sm hover:underline"
                        onClick={() => deleteFromHistory(order)}
                      >
                        {t("DeleteOrder")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {showModal && selectedOrder && (
            <div className="modal-backdrop" onClick={() => setShowModal(false)}>
              <div className="modal-card modal-card-md p-6 w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="erp-page-title mb-4">{t("OrderDetails")}</h3>
                <p className="text-gray-700 mb-2"><strong>{t("TableNumber")}:</strong> {selectedOrder.tableId?.tableNumber ?? "-"}</p>
                <p className="text-gray-700 mb-2"><strong>{t("OrderDate")}:</strong> {formatOrderTime(selectedOrder.createdAt)}</p>
                <div className="text-gray-700 mb-2">
                  <strong>{t("Items")}:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {(selectedOrder.items || []).map((item) => (
                      <li key={item.foodId?._id || item.foodId}>
                        {item.foodId?.name || "Item"} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" className="btn-secondary mt-4" onClick={() => setShowModal(false)}>{t("Close")}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KitchenOrderHistory;
