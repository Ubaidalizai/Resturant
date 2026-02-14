import React, { useEffect, useState } from "react";
import axios from "axios";

function KitchenOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // dummy fetch example
    // replace with your API
    const fetchOrders = async () => {
      try {
        // مثال لپاره: fake API یا localStorage
        // const response = await axios.get("/api/orders");
        const response = [
          { id: 1, name: "Burger", quantity: 2, status: "Preparing" },
          { id: 2, name: "Pizza", quantity: 1, status: "Ready" },
          { id: 3, name: "Pasta", quantity: 3, status: "Preparing" },
        ];

        setOrders(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Kitchen Orders</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transform transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{order.name}</h3>
              <p className="text-gray-500 mb-1">Quantity: {order.quantity}</p>
              <p
                className={`font-semibold ${
                  order.status === "Ready" ? "text-green-600" : "text-orange-500"
                }`}
              >
                Status: {order.status}
              </p>
              <button
                className="mt-4 w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default KitchenOrders;
