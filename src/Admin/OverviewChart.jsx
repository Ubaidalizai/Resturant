import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InputField from "../Components/UI/InputField";

function OverviewChart() {
  const { t, i18n } = useTranslation("common");
  const { get } = useApi();
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("monthly"); // all, daily, weekly, monthly, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch chart data from API
  const loadChartData = async () => {
    try {
      let endpoint = "/api/v1/analytics/chart-data";
      if (filter === "custom" && startDate && endDate) {
        endpoint += `?start=${startDate}&end=${endDate}`;
      } else {
        endpoint += `?type=${filter}`;
      }

      const res = await get(endpoint);
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
    if (filter === "daily") return t("Last7Days", { defaultValue: "Last 7 Days" });
    if (filter === "weekly") return t("Last4Weeks", { defaultValue: "Last 4 Weeks" });
    if (filter === "monthly") return t("Last6Months", { defaultValue: "Last 6 Months" });
    return "";
  };

  // Tooltip formatter
  const tooltipFormatter = (value, name) => {
    if (name === t("Revenue", { defaultValue: "Revenue" })) return `${t("CurrencySymbol", { defaultValue: "$" })}${Number(value).toLocaleString(i18n.language)}`;
    if (name === t("Orders", { defaultValue: "Orders" })) return Number(value);
    return value;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full">
      {/* Title */}
      <h2 className="text-xl font-bold text-yellow-600 mb-2 text-center">
        {t("RevenueOrdersOverview", { defaultValue: "Revenue & Orders Overview" })}
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
          <option value="daily">{t("daily", { defaultValue: "Daily" })}</option>
          <option value="weekly">{t("weekly", { defaultValue: "Weekly" })}</option>
          <option value="monthly">{t("monthly", { defaultValue: "Monthly" })}</option>
          <option value="custom">{t("custom", { defaultValue: "Custom" })}</option>
        </select>

        {filter === "custom" && (
          <>
            <InputField
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 text-black p-2 rounded w-50"
            />
            <InputField
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
          <YAxis tickFormatter={(value) => `${t("CurrencySymbol", { defaultValue: "$" })}${value.toLocaleString(i18n.language)}`} />
          <Tooltip formatter={tooltipFormatter} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#facc90"
            strokeWidth={3}
            name={t("Revenue", { defaultValue: "Revenue" })}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#ef4444"
            strokeWidth={2}
            name={t("Orders", { defaultValue: "Orders" })}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;