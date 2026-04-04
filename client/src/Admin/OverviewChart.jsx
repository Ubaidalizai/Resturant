import React, { useEffect, useMemo, useRef, useState } from "react";
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
  BarChart,
  Bar,
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Canvg from "canvg";
import InputField from "../Components/UI/InputField";

function OverviewChart() {
  const { t, i18n } = useTranslation("common");
  const { get } = useApi();
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("monthly"); // all, daily, weekly, monthly, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef(null);
  const chartRef = useRef(null);

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

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
    [chartData]
  );

  const totalOrders = useMemo(
    () => chartData.reduce((sum, item) => sum + Number(item.orders || 0), 0),
    [chartData]
  );

  const downloadFileName = `${filter === "custom" ? "custom-range" : filter}-overview-report-${new Date()
    .toISOString()
    .slice(0, 10)}`;

  const isDownloadDisabled =
    chartData.length === 0 ||
    (filter === "custom" && (!startDate || !endDate)) ||
    isDownloading;

  const handleDownloadPdf = async () => {
    if (!chartRef.current) return;
    setIsDownloading(true);

    try {
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('SVG element not found');
      }
      const svgString = svgElement.outerHTML;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = svgElement.clientWidth * 2;
      canvas.height = svgElement.clientHeight * 2;
      const canvgInstance = Canvg.fromString(ctx, svgString);
      await canvgInstance.render();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;

      // Header box
      pdf.setFillColor(255, 248, 220); // Light yellow background
      pdf.rect(0, 0, pageWidth, 80, 'F');
      pdf.setDrawColor(255, 193, 7);
      pdf.setLineWidth(2);
      pdf.rect(0, 0, pageWidth, 80);

      // Company title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.setTextColor(255, 193, 7);
      const title = t('RestaurantManagementSystem', 'Restaurant Management System');
      const titleWidth = pdf.getTextWidth(title);
      pdf.text(title, (pageWidth - titleWidth) / 2, 35);

      // Report title
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      const subtitle = t('FinancialOperationalReport', 'Financial & Operational Report');
      const subtitleWidth = pdf.getTextWidth(subtitle);
      pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 55);

      // Generation date
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const currentDate = new Date().toLocaleDateString();
      pdf.text(`${t('GeneratedOn', 'Generated on')}: ${currentDate}`, pageWidth - margin - 150, 75);

      let yPosition = 100;

      // Summary section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(t('ExecutiveSummary', 'Executive Summary'), margin, yPosition);
      yPosition += 20;

      // Summary box
      pdf.setFillColor(248, 248, 248);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(1);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 60);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${t('Period', 'Period')}: ${getDateRangeText()}`, margin + 10, yPosition + 20);
      pdf.text(`${t('TotalRevenue', 'Total Revenue')}: $${totalRevenue.toLocaleString()}`, margin + 10, yPosition + 35);
      pdf.text(`${t('TotalOrders', 'Total Orders')}: ${totalOrders.toLocaleString()}`, margin + 10, yPosition + 50);
      yPosition += 80;

      // Data Table section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(t('DetailedData', 'Detailed Data'), margin, yPosition);
      yPosition += 10;

      const tableData = chartData.map(item => [item.date, `$${item.revenue.toLocaleString()}`, item.orders.toString()]);
      autoTable(pdf, {
        head: [[t('Date', 'Date'), t('Revenue', 'Revenue'), t('Orders', 'Orders')]],
        body: tableData,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [255, 193, 7], textColor: 0, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        margin: { left: margin, right: margin },
        alternateRowStyles: { fillColor: [248, 248, 248] },
      });

      yPosition = pdf.lastAutoTable.finalY + 20;

      // Chart section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(t('RevenueOrdersTrend', 'Revenue & Orders Trend'), margin, yPosition);
      yPosition += 15;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(t('VisualAnalysis', 'Visual analysis of revenue and order patterns over the selected period'), margin, yPosition);
      yPosition += 20;

      // Chart image
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = yPosition;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      while (heightLeft > 0) {
        pdf.addPage();
        // Add footer to new page
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(t('Confidential', 'Restaurant Management System - Confidential'), margin, pageHeight - 20);
        pdf.text(`${t('Page', 'Page')} ${pdf.internal.getNumberOfPages()}`, pageWidth - margin - 50, pageHeight - 20);
        position = margin;
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      // Footer on first page
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(t('Confidential', 'Restaurant Management System - Confidential'), margin, pageHeight - 20);
      pdf.text(`${t('Page', 'Page')} 1`, pageWidth - margin - 50, pageHeight - 20);

      pdf.save(`${downloadFileName}.pdf`);
    } catch (error) {
      console.error('Failed to create PDF:', error);
    } finally {
      setIsDownloading(false);
    }
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <p className="text-center text-gray-500 mb-4 sm:mb-0">{getDateRangeText()}</p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isDownloadDisabled}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            isDownloadDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {isDownloading
            ? t("Downloading", { defaultValue: "Downloading..." })
            : t("DownloadPDF", { defaultValue: "Download PDF" })}
        </button>
      </div>

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

      <div ref={exportRef} className="bg-white">
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <div className="rounded-2xl border border-gray-200 p-4 bg-slate-50">
            <p className="text-sm text-gray-500">{t("TotalRevenue", { defaultValue: "Total Revenue" })}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {t("CurrencySymbol", { defaultValue: "$" })}
              {totalRevenue.toLocaleString(i18n.language)}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4 bg-slate-50">
            <p className="text-sm text-gray-500">{t("TotalOrders", { defaultValue: "Total Orders" })}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{totalOrders.toLocaleString(i18n.language)}</p>
          </div>
        </div>

        <div className="w-full h-[400px] mb-6">
          <ResponsiveContainer ref={chartRef} width="100%" height="100%">
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

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t("Date", { defaultValue: "Date" })}</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">{t("Revenue", { defaultValue: "Revenue" })}</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">{t("Orders", { defaultValue: "Orders" })}</th>
              </tr>
            </thead>
            <tbody>
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <tr key={`${item.date}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-3 text-gray-700">{item.date}</td>
                    <td className="px-4 py-3 text-right text-gray-800">
                      {t("CurrencySymbol", { defaultValue: "$" })}
                      {Number(item.revenue).toLocaleString(i18n.language)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">{Number(item.orders).toLocaleString(i18n.language)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                    {t("NoReportData", { defaultValue: "No report data available" })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OverviewChart;