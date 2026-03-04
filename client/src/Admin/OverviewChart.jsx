import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { baseURL } from "../configs/baseURL.config";

function OverviewChart() {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("daily"); // daily, weekly, monthly, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch chart data from API
  const loadChartData = async () => {
    try {
      let url = `${baseURL}/api/v1/analytics/chart-data`;
      if (filter === "custom" && startDate && endDate) {
        url += `?start=${startDate}&end=${endDate}`;
      } else {
        url += `?type=${filter}`;
      }

      const res = await axios.get(url);
      // Format data: revenue as number
      const formattedData = (res.data.data || []).map(item => ({
        ...item,
        revenue: Number(item.revenue),
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }));
      setChartData(formattedData);
    } catch (err) {
      console.error("Failed to load chart data:", err);
      setChartData([]);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [filter, startDate, endDate]);

  const getDateRangeText = () => {
    if (filter === "custom" && startDate && endDate) return `${startDate} → ${endDate}`;
    if (filter === "daily") return "Last 7 Days";
    if (filter === "weekly") return "Last 4 Weeks";
    if (filter === "monthly") return "Last 6 Months";
    return "";
  };

  // Tooltip formatter
  const tooltipFormatter = (value, name) => {
    if (name === "Revenue ($)") return `$${Number(value).toLocaleString()}`;
    return value;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full">
      {/* Title */}
      <h2 className="text-xl font-bold text-yellow-600 mb-2 text-center">
        Revenue & Orders Overview
      </h2>

      {/* Selected date range */}
      <p className="text-center text-gray-500 mb-4">{getDateRangeText()}</p>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 text-black p-2 rounded w-50 outline-yellow-600"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom Range</option>
        </select>

        {filter === "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 text-black p-2 rounded w-50"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 text-black p-2 rounded w-50"
            />
          </>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
          <Tooltip formatter={tooltipFormatter} />
          {/* df */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#facc90"
            strokeWidth={3}
            name="Revenue ($)"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#ef4444"
            strokeWidth={2}
            name="Orders"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;