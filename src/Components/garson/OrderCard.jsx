// OrderCard.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const OrderCard = ({ order, itemNames, total, loadOrderToCart }) => {
  const { t } = useTranslation("common");

  return (
    <div
      key={order._id}
      className="bg-white p-4 rounded-lg shadow w-64 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold text-black">
        {order.customer || t("UnknownCustomer", { defaultValue: "Unknown Customer" })}
      </h3>
      <p className="text-gray-600">
        {t("Table", { defaultValue: "Table" })}: {order.tableNumber || order.tableId?.tableNumber || t("NotAvailable", { defaultValue: "N/A" })}
      </p>
      <p className="text-gray-600 text-sm truncate">{itemNames}</p>
      <p className="text-red-600 font-bold mt-2">{t("Total", { defaultValue: "Total" })}: ${total}</p>
      <button
        className="mt-2 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
        onClick={() => loadOrderToCart(order)}
      >
        {t("AddItems", { defaultValue: "Add Items" })}
      </button>
    </div>
  );
};

export default OrderCard;