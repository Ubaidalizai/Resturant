import React, { useEffect, useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";

const PIE_COLORS = ["#1e40af", "#dc2626", "#16a34a", "#d97706"];

function DashboardAnalytics({ dashboardData, topFood }) {
  const { t, i18n } = useTranslation("common");
  const { get } = useApi();
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let endpoint = "/api/v1/analytics/chart-data";
    if (filter === "custom" && startDate && endDate) {
      endpoint += `?start=${startDate}&end=${endDate}`;
    } else {
      endpoint += `?type=${filter}`;
    }

    get(endpoint)
      .then((res) => {
        const formatted = (res.data.data || []).map((item) => ({
          ...item,
          revenue: Number(item.revenue),
          orders: Number(item.orders),
          date: filter === "monthly"
            ? item.date
            : new Date(item.date).toLocaleDateString(i18n.language, { month: "short", day: "numeric" }),
        }));
        setChartData(formatted);
      })
      .catch(() => setChartData([]));
  }, [filter, startDate, endDate, i18n.language]);

  const getDateRangeText = () => {
    if (filter === "custom" && startDate && endDate) return `${startDate} → ${endDate}`;
    if (filter === "daily") return t("Last7Days");
    if (filter === "weekly") return t("Last4Weeks");
    if (filter === "monthly") return t("Last6Months");
    return "";
  };

  const pieData = dashboardData
    ? [
        { name: t("Revenue"), value: dashboardData.monthRevenue || 0 },
        { name: t("Expenses"), value: dashboardData.monthExpenses || 0 },
        { name: t("PaidSalaries"), value: dashboardData.paidSalaries || 0 },
      ].filter((d) => d.value > 0)
    : [];

  const barData = dashboardData
    ? [
        { name: t("Revenue"), amount: dashboardData.monthRevenue || 0 },
        { name: t("Expenses"), amount: dashboardData.monthExpenses || 0 },
        { name: t("PaidSalaries"), amount: dashboardData.paidSalaries || 0 },
        { name: t("PendingSalaries"), amount: dashboardData.pendingSalaries || 0 },
      ]
    : [];

  return (
    <div className="erp-panel p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            {t("DashboardAnalytics")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{getDateRangeText()}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="erp-select w-auto">
            <option value="daily">{t("daily")}</option>
            <option value="weekly">{t("weekly")}</option>
            <option value="monthly">{t("monthly")}</option>
            <option value="custom">{t("custom")}</option>
          </select>
          {filter === "custom" && (
            <>
              <InputField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="erp-input w-auto" />
              <InputField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="erp-input w-auto" />
            </>
          )}
        </div>
      </div>

      {topFood && (
        <div className="bg-slate-50 border border-slate-200 rounded px-4 py-3">
          <span className="text-xs text-slate-500 uppercase tracking-wide">{t("TopSellingFood")}</span>
          <p className="font-semibold text-slate-800 mt-0.5">
            {topFood.name} — {topFood.totalSold} {t("Sold")}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 min-w-0">
        <div className="lg:col-span-2 min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === t("Revenue") ? `$${Number(value).toLocaleString()}` : value
                }
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#64748b" strokeWidth={2} name={t("Orders")} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#1e40af" strokeWidth={2} name={t("Revenue")} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="min-w-0 space-y-4">
          {pieData.length > 0 && (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} label={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
              <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
              <Bar dataKey="amount" fill="#1e40af" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
