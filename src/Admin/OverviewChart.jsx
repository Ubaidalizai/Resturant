import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function OverviewChart() {
  const [chartData, setChartData] = useState([]);


  const loadChartData = () => {
    const orders = JSON.parse(localStorage.getItem("Orders")) || [];

    const grouped = {};

    orders.forEach((order) => {
      if (!grouped[order.date]) {
        grouped[order.date] = {
          date: order.date,
          revenue: 0,
          orders: 0,
        };
      }
      grouped[order.date].revenue += Number(order.orderTotal);
      grouped[order.date].orders += 1;
    });

    setChartData(Object.values(grouped));
  };

  useEffect(() => {
    
    loadChartData();

    
    const interval = setInterval(() => {
      loadChartData();
    }, 2000);

    
    const handleOrdersUpdate = () => loadChartData();
    window.addEventListener("ordersUpdated", handleOrdersUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("ordersUpdated", handleOrdersUpdate);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full">
      <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center">
        Daily Revenue & Orders
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#facc15"
            strokeWidth={3}
            name="Revenue ($)"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#ef4444"
            strokeWidth={2}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;
