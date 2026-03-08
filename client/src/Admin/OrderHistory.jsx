import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { baseURL } from "../configs/baseURL.config";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // orders per page
  const [modal, setModal] = useState(null);
  const [foodModal, setFoodModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders
  useEffect(() => {
    axios.get(`${baseURL}/api/v1/orders/all`)
      .then((res) => {
        const formatted = res.data.data
          .filter(order => order.isPaid) // only paid orders
          .map(order => ({
            ...order,
            date: new Date(order.createdAt).toLocaleDateString("en-US"),
            orderTotal: order.totalAmount || order.amount || 0,
            items: order.items.map(item => ({
              name: item.foodId?.name || "Unknown",
              price: item.foodId?.price || 0,
              quantity: item.quantity,
            }))
          }));
        setOrders(formatted);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const deleteOrder = (id) => {
    const updated = orders.filter((o) => o._id !== id);
    setOrders(updated);
    toast.success("Order deleted successfully");
  };

  // Grand total for all paid orders
  const grandTotal = orders.reduce((sum, o) => sum + Number(o.orderTotal), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-600 text-center mb-6">
        Order History
      </h1>

      {/* Orders Table */}
      {currentOrders.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-3xl text-center font-semibold text-gray-500 shadow-xl">
          No orders found
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-3xl shadow-2xl p-4 text-black">
            <table className="w-full text-center min-w-[600px]">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-3">Foods</th>
                  <th className="py-3">Qty</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-yellow-50 transition">
                    <td
                      className="py-2 text-black cursor-pointer hover:underline"
                      onClick={() => { setSelectedOrder(order); setFoodModal(true); }}
                    >
                      {order.items.map((i) => i.name).join(", ")}
                    </td>
                    <td className="py-2">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                    <td className="py-2 text-black">${order.orderTotal}</td>
                    <td className="py-2">{order.date}</td>
                    <td className="py-2">
                      <AiOutlineDelete
                        className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                        onClick={() => { setSelectedOrder(order); setModal("delete"); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {currentOrders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-2xl shadow">
                <div className="flex justify-between font-bold text-yellow-600">
                  <span>{order.date}</span>
                  <span className="text-red-600">${order.orderTotal}</span>
                </div>
                <div className="mt-2 text-yellow-600 cursor-pointer"
                  onClick={() => { setSelectedOrder(order); setFoodModal(true); }}
                >
                  {order.items.map((i) => i.name).join(", ")}
                </div>
                <AiOutlineDelete
                  className="mt-2 text-red-500 text-xl cursor-pointer"
                  onClick={() => { setSelectedOrder(order); setModal("delete"); }}
                />
              </div>
            ))}
          </div>

          {/* Pagination above Grand Total */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-yellow-600 text-white py-2 px-4 rounded-2xl disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-2 px-4 font-bold text-black">{currentPage} / {totalPages}</span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-yellow-600 text-white py-2 px-4 rounded-2xl disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Grand Total */}
          <div className="max-w-sm ml-auto mt-4 bg-yellow-50 p-4 rounded-3xl shadow-2xl flex justify-between font-bold">
            <span className="text-yellow-600">Grand Total (Paid Orders)</span>
            <span className="text-red-600">${grandTotal}</span>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-red-500 text-center mb-4">Delete Order</h2>
            <p className="text-center mb-4 text-black">Are you sure you want to delete this order?</p>
            <div className="flex gap-4">
              <button onClick={() => setModal(null)}
                className="w-full bg-yellow-600 py-2 rounded-2xl font-bold text-white cursor-pointer">
                Cancel
              </button>
              <button onClick={() => { deleteOrder(selectedOrder._id); setModal(null); setSelectedOrder(null); }}
                className="w-full bg-red-500 text-white py-2 rounded-2xl font-bold cursor-pointer">
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
            <div className="flex flex-row w-full justify-between mb-4">
              <h2 className="text-2xl font-bold text-center text-yellow-600">Food Details</h2>
              <button onClick={() => { setFoodModal(false); setSelectedOrder(null); }}
                className="top-4 right-4 font-bold text-yellow-600 text-xl cursor-pointer">
                X
              </button>
            </div>
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
                    <td className="py-2 font-bold">${item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;