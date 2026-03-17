import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from '../context/ApiContext';
import Button from "../Components/UI/Button";

function KitchenOrders() {
  const { t } = useTranslation("common");
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await get("/api/v1/orders/all");
        const serverOrders = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setOrders(serverOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [get]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
        {t("KitchenOrders", { defaultValue: "Kitchen Orders" })}
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">{t("LoadingOrders", { defaultValue: "Loading orders..." })}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">{t("NoOrdersAvailable", { defaultValue: "No orders available." })}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transform transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{order.items?.[0]?.foodId?.name || t("UnknownFood", { defaultValue: "Unknown Food" })}</h3>
              <p className="text-gray-500 mb-1">{t("Quantity", { defaultValue: "Quantity" })}: {order.items?.reduce((sum, i) => sum + (i.amount || i.quantity || 0), 0) || (order.quantity ?? 0)}</p>
              <p
                className={`font-semibold ${
                  order.status === "Ready" ? "text-green-600" : "text-orange-500"
                }`}
              >
                {t("Status", { defaultValue: "Status" })}: {t(order.status, { defaultValue: order.status })}
              </p>
              <Button className="mt-4 w-full">
                {t("MarkAsCompleted", { defaultValue: "Mark as Completed" })}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default KitchenOrders;
