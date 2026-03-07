// OrderCard.jsx
import React from "react";

const OrderCard = ({ order, itemNames, total, loadOrderToCart }) => {
  return (
    <div
      key={order._id}
      className="bg-white p-4 rounded-lg shadow w-64 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold text-black">
        {order.customer || "Unknown Customer"}
      </h3>
      <p className="text-gray-600">
        Table: {order.tableNumber || order.tableId?.tableNumber || "N/A"}
      </p>
      <p className="text-gray-600 text-sm truncate">{itemNames}</p>
      <p className="text-red-600 font-bold mt-2">Total: ${total}</p>
      <button
        className="mt-2 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
        onClick={() => loadOrderToCart(order)}
      >
        Add Items
      </button>
    </div>
  );
};

export default OrderCard;