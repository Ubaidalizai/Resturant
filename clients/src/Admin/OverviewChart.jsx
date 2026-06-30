import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { useTranslation } from "react-i18next";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import InputField from "../Components/UI/InputField";

function OverviewChart() {
  const { t, i18n } = useTranslation("common");
  const { get } = useApi();
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadChartData = async () => {
    try {
      let endpoint = "/api/v1/analytics/chart-data";
      if (filter === "custom" && startDate && endDate) {
        endpoint += `?start=${startDate}&end=${endDate}`;
      } else {
        endpoint += `?type=${filter}`;
      }

      const res = await get(endpoint);
      const formattedData = (res.data.data || []).map((item) => ({
        ...item,
        revenue: Number(item.revenue),
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
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

  const tooltipFormatter = (value, name) => {
    if (name === t("Revenue", { defaultValue: "Revenue" })) return `$${Number(value).toLocaleString(i18n.language)}`;
    if (name === t("Orders", { defaultValue: "Orders" })) return Number(value);
    return value;
  };

  return (
    <div className="erp-panel p-4 w-full">
      <h2 className="text-sm font-semibold text-slate-700 mb-1 uppercase tracking-wide">
        {t("RevenueOrdersOverview", { defaultValue: "Revenue & Orders Overview" })}
      </h2>
      <p className="text-xs text-slate-500 mb-4">{getDateRangeText()}</p>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="erp-select w-auto"
        >
          <option value="daily">{t("daily", { defaultValue: "Daily" })}</option>
          <option value="weekly">{t("weekly", { defaultValue: "Weekly" })}</option>
          <option value="monthly">{t("monthly", { defaultValue: "Monthly" })}</option>
          <option value="custom">{t("custom", { defaultValue: "Custom" })}</option>
        </select>

        {filter === "custom" && (
          <>
            <InputField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="erp-input w-auto" />
            <InputField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="erp-input w-auto" />
          </>
        )}
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value.toLocaleString(i18n.language)}`} />
          <Tooltip formatter={tooltipFormatter} />
          <Line type="monotone" dataKey="revenue" stroke="#1e40af" strokeWidth={2} name={t("Revenue", { defaultValue: "Revenue" })} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="orders" stroke="#64748b" strokeWidth={2} name={t("Orders", { defaultValue: "Orders" })} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;
