import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [modal, setModal] = useState(null);
  const [foodModal, setFoodModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  
  const normalizeDate = (date) =>
    new Date(date).toISOString().split("T")[0];

  
  useEffect(() => {
    const data = localStorage.getItem("Orders");
    if (data) {
      setOrders(JSON.parse(data));
    }
  }, []);

  
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesDate = filterDate
        ? normalizeDate(order.date) === filterDate
        : true;

      const matchesCategory =
        filterCategory === "all"
          ? true
          : order.items.some(
              (item) =>
                item.category.toLowerCase() === filterCategory.toLowerCase() );

      return matchesDate && matchesCategory;
    });

    setFilteredOrders(filtered);
  }, [orders, filterDate, filterCategory]);

 
  const deleteOrder = (id) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    localStorage.setItem("Orders", JSON.stringify(updated));
    toast.success("Order deleted successfully");
  };

  const grandTotal = filteredOrders.reduce(
    (sum, o) => sum + Number(o.orderTotal),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-600 text-center mb-6">
        Order History
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 text-black">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded-2xl py-2 px-4 focus:ring-2 focus:ring-yellow-400 outline-none"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-2xl py-2 px-4 focus:ring-2 focus:ring-yellow-400 outline-none"
        >
          <option value="all">All</option>
          <option value="breakfast">Breakfast</option>
          <option value="Lunch & Dinner">Lunch</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-3xl text-center font-semibold text-gray-500 shadow-xl">
          No orders found
        </div>
      ) : (
        <>
          {/* Table (Desktop) */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-3xl shadow-2xl p-4 text-black">
            <table className="w-full min-w-[600px] text-center">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-3">Foods</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Total</th>
                 <th className="py-3">Date</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-yellow-50 transition"
                  >
                    <td
                      className="py-2 text-black cursor-pointer hover:underline"
                      onClick={() => {
                        setSelectedOrder(order);
                        setFoodModal(true);
                      }}
                    >
                      {order.items.map((i) => i.name).join(", ")}
                    </td>
                    <td className="py-2">
                      {[...new Set(order.items.map((i) => i.category))].join(
                        ", "
                      )}
                    </td>
                    <td className="py-2 font-bold text-red-600">
                      ${order.orderTotal}
                    </td>
                    <td className="py-2">{normalizeDate(order.date)}</td>
                    <td className="py-2">
                      <AiOutlineDelete
                        className="text-red-500 text-xl cursor-pointer hover:text-red-700 ml-[81px]"
                        onClick={() => {
                          setSelectedOrder(order);
                          setModal("delete");
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (Mobile) */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-2xl shadow"
              >
                <div className="flex justify-between font-bold text-yellow-600">
                  <span>{normalizeDate(order.date)}</span>
                  <span className="text-red-600">${order.orderTotal}</span>
                </div>

                <div
                  className="mt-2 text-yellow-600 cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setFoodModal(true);
                  }}
                >
                  {order.items.map((i) => i.name).join(", ")}
                </div>

                <AiOutlineDelete
                  className="mt-2 text-red-500 text-xl cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setModal("delete");
                  }}
                />
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="max-w-sm ml-auto mt-6 bg-yellow-50 p-4 rounded-3xl shadow-2xl flex justify-between font-bold">
            <span className="text-yellow-600">Grand Total</span>
            <span className="text-red-600">${grandTotal}</span>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-red-500 text-center mb-4">
              Delete Order
            </h2>
            <p className="text-center mb-4 text-black">
              Are you sure you want to delete this order?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setModal(null)}
                className="w-full bg-yellow-100 py-2 rounded-2xl font-bold text-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOrder(selectedOrder.id);
                  setModal(null);
                  setSelectedOrder(null);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-2xl font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Modal */}
      {foodModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl p-6 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-yellow-600 mb-4">
              Food Details
            </h2>
            <table className="w-full text-center text-black">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-2">Name</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">${item.price}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2 font-bold">
                      ${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => {
                setFoodModal(false);
                setSelectedOrder(null);
              }}
              className="mt-4 w-full bg-yellow-100 py-2 rounded-2xl font-bold text-black cursor-pointer hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
