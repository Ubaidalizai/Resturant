import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";

function OrderHistory() {
  const { t, i18n } = useTranslation("common");
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [visiblePages, setVisiblePages] = useState(2);
  const [foodModal, setFoodModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { confirmState, openConfirm, closeConfirm, handleConfirm } = useConfirmModel();

  useEffect(() => {
    get("/api/v1/orders/all")
      .then((res) => {
        const formatted = res.data.data
          .filter((order) => order.isPaid)
          .map((order) => ({
            ...order,
            date: new Date(order.createdAt).toLocaleDateString(i18n.language),
            orderTotal: order.totalAmount || order.amount || 0,
            createdAt: order.createdAt,
            customerName: order.customer || t("Guest", { defaultValue: "Guest" }),
            tableNumber: order.tableId?.tableNumber ?? "",
            orderDetails: (order.items || [])
              .map((item) => `${item.foodId?.name || "Unknown"} × ${item.quantity}`)
              .join(", "),
            items: order.items.map((item) => ({
              name: item.foodId?.name || "Unknown",
              price: item.foodId?.price || 0,
              quantity: item.quantity,
            })),
          }));
        setOrders(formatted);
      })
      .catch((err) => console.error("Error fetching orders:", err));

    get("/api/v1/analytics/top-selling-items?limit=10")
      .then((res) => setTopItems(res.data.data || []))
      .catch(() => setTopItems([]));
  }, [i18n.language]);

  const filteredOrders = orders.filter((o) => {
    const od = new Date(o.createdAt);
    const now = new Date();
    if (filter === "daily") return od.toDateString() === now.toDateString();
    if (filter === "weekly") return (now - od) / (1000 * 60 * 60 * 24) < 7;
    if (filter === "monthly") return od.getMonth() === now.getMonth() && od.getFullYear() === now.getFullYear();
    if (filter === "custom" && startDate && endDate) {
      return od >= new Date(startDate) && od <= new Date(endDate);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfLastOrder - ordersPerPage, indexOfLastOrder);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [currentPage, totalPages]);

  const grandTotal = filteredOrders.reduce((sum, o) => sum + Number(o.orderTotal), 0);

  const deleteOrder = (id) => {
    setOrders(orders.filter((o) => o._id !== id));
    toast.success(t("OrderDeletedSuccessfully"));
  };

  const chartData = topItems.map((item) => ({
    name: item.name?.length > 15 ? `${item.name.slice(0, 15)}…` : item.name,
    fullName: item.name,
    sold: item.totalSold,
  }));

  return (
    <div className="space-y-4">
      {chartData.length > 0 && (
        <div className="erp-panel p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
            {t("Top10BestSelling")}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} height={70} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, t("Qty")]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
              />
              <Legend />
              <Bar dataKey="sold" fill="#1e40af" name={t("QuantitySold")} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="erp-panel p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["all", "daily", "weekly", "monthly", "custom"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={filter === f ? "btn-primary" : "btn-secondary"}
              >
                {t(f)}
              </button>
            ))}
          </div>
          {filter === "custom" && (
            <div className="flex gap-3 flex-wrap">
              <InputField type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="w-auto" />
              <InputField type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="w-auto" />
            </div>
          )}
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <div className="erp-panel p-8 text-center text-slate-500">
          {t("NoOrdersFound")}
        </div>
      ) : (
        <>
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>{t("Customer", { defaultValue: "Customer" })}</th>
                  <th>{t("TableNumber", { defaultValue: "Table Number" })}</th>
                  <th>{t("OrderDetails", { defaultValue: "Order Details" })}</th>
                  <th>{t("Qty")}</th>
                  <th>{t("Total")}</th>
                  <th>{t("Date")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>{order.tableNumber || "—"}</td>
                    <td className="cursor-pointer text-blue-700 hover:underline max-w-xs truncate" onClick={() => { setSelectedOrder(order); setFoodModal(true); }} title={order.orderDetails}>
                      {order.orderDetails || order.items.map((i) => i.name).join(", ")}
                    </td>
                    <td>{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                    <td className="text-red-600 font-semibold">${Math.round(Number(order.orderTotal))}</td>
                    <td>{order.date}</td>
                    <td>
                      <AiOutlineDelete
                        className="text-red-600 cursor-pointer"
                        size={18}
                        onClick={() => openConfirm({
                          title: t("DeleteOrder"),
                          message: t("ConfirmDeleteOrderMessage", { date: order.date }),
                          onConfirm: () => deleteOrder(order._id),
                        })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="erp-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t("Pages")}</span>
              <select value={visiblePages} onChange={(e) => { setVisiblePages(Number(e.target.value)); setCurrentPage(1); }} className="erp-select w-auto">
                {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-secondary" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>{t("Previous")}</button>
              <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
              <button type="button" className="btn-secondary" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>{t("Next")}</button>
            </div>
            <div className="text-sm font-semibold">
              {t("GrandTotal")}: <span className="text-red-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}

      {foodModal && selectedOrder && (
        <div className="modal-backdrop" onClick={() => setFoodModal(false)}>
          <div className="modal-card modal-card-md p-6 w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="erp-page-title mb-4">{t("OrderDetails")}</h3>
            <p className="text-sm text-slate-600 mb-2">
              {t("Customer", { defaultValue: "Customer" })}: <strong>{selectedOrder.customerName}</strong>
            </p>
            <p className="text-sm text-slate-600 mb-3">
              {t("TableNumber", { defaultValue: "Table Number" })}: <strong>{selectedOrder.tableNumber || "—"}</strong>
            </p>
            <ul className="space-y-2 text-sm">
              {selectedOrder.items.map((item, i) => (
                <li key={i} className="flex justify-between border-b border-slate-100 pb-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-secondary mt-4" onClick={() => setFoodModal(false)}>{t("Close")}</button>
          </div>
        </div>
      )}

      <ConfirmModel isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={handleConfirm} onCancel={closeConfirm} />
    </div>
  );
}

export default OrderHistory;
