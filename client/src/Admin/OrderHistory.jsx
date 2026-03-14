import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import { ItemsContext } from "../App";

function OrderHistory() {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [visiblePages, setVisiblePages] = useState(2);
  const [modal, setModal] = useState(null);
  const [foodModal, setFoodModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {user} = useContext(ItemsContext);
  // Fetch orders
  useEffect(() => {
    get("/api/v1/orders/all")
      .then((res) => {
        const formatted = res.data.data
          .filter((order) => order.isPaid)
          .map((order) => ({
            ...order,
            date: new Date(order.createdAt).toLocaleDateString("en-US"),
            orderTotal: order.totalAmount || order.amount || 0,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              name: item.foodId?.name || "Unknown",
              price: item.foodId?.price || 0,
              quantity: item.quantity,
            })),
          }));
        setOrders(formatted);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const od = new Date(o.createdAt);
    const now = new Date();

    if (filter === "daily") return od.toDateString() === now.toDateString();
    if (filter === "weekly") {
      const diff = (now - od) / (1000 * 60 * 60 * 24);
      return diff < 7;
    }
    if (filter === "monthly")
      return od.getMonth() === now.getMonth() && od.getFullYear() === now.getFullYear();
    if (filter === "custom" && startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      return od >= s && od <= e;
    }
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const grandTotal = filteredOrders.reduce((sum, o) => sum + Number(o.orderTotal), 0);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const deleteOrder = (id) => {
    const updated = orders.filter((o) => o._id !== id);
    setOrders(updated);
    toast.success("Order deleted successfully");
  };

  // Determine which page numbers to display
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-600 text-center mb-6">
        Order History
      </h1>

      {/* Filter Section */}
      <div className="bg-white shadow-xl rounded-3xl p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["all", "daily", "weekly", "monthly", "custom"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl font-semibold transition
                ${filter === f ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-yellow-100"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filter === "custom" && (
          <div className="flex gap-3 flex-wrap">
            <InputField
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="border-2 border-yellow-500 rounded-xl p-2 text-black"
            />
            <InputField
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="border-2 border-yellow-500 rounded-xl p-2 text-black"
            />
          </div>
        )}
      </div>

      {/* Orders Table */}
      {currentOrders.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-3xl text-center font-semibold text-gray-500 shadow-xl">
          No orders found
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto bg-white rounded-3xl shadow-2xl p-4 text-black">
            <table className="w-full text-center min-w-[600px]">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-3">Foods</th>
                  <th className="py-3">Qty</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-yellow-50">
                    <td className="py-2 cursor-pointer hover:underline"
                      onClick={() => { setSelectedOrder(order); setFoodModal(true); }}>
                      {order.items.map((i) => i.name).join(", ")}
                    </td>
                    <td className="py-2">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                    <td className="py-2 text-red-600 font-semibold">${order.orderTotal}</td>
                    <td className="py-2 text-black">{order.date}</td>
                    <td className="py-2">
                      <div className="flex justify-center">
                        <AiOutlineDelete
                          className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                          onClick={() => { setSelectedOrder(order); setModal("delete"); }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700">Pages:</span>
              <select
                value={visiblePages}
                onChange={(e) => { setVisiblePages(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-yellow-500 text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-yellow-600 cursor-pointer"
              >
                <option value={2}>2 Pages</option>
                <option value={3}>3 Pages</option>
                <option value={4}>4 Pages</option>
                <option value={5}>5 Pages</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <span className="font-semibold text-gray-800">{currentPage} / {totalPages}</span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {/* Grand Total */}
          <div className="max-w-sm ml-auto mt-4 bg-yellow-50 p-4 rounded-3xl shadow-2xl flex justify-between font-bold">
            <span className="text-yellow-600">Grand Total ({filter.charAt(0).toUpperCase() + filter.slice(1)} Orders)</span>
            <span className="text-red-600">${grandTotal.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderHistory;