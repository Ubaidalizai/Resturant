import React, { useEffect, useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useApi } from "../context/ApiContext";
import { FaChair, FaCheckCircle, FaClock, FaUtensils, FaPrint } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Components/UI/Button";
import Logo from "../images/logo.jpg";

function Tables() {
  const { t, i18n } = useTranslation("common");
  const { get } = useApi();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTableOrdersLoading, setSelectedTableOrdersLoading] = useState(false);

  const fetchTableOrders = async (tableId) => {
    try {
      const res = await get(`/api/v1/orders/table/${tableId}`);
      return res.data.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSelectTable = async (tableData) => {
    setSelectedTable({ ...tableData, orders: [] });
    setSelectedTableOrdersLoading(true);
    try {
      const orders = await fetchTableOrders(tableData.id);
      setSelectedTable({ ...tableData, orders });
    } finally {
      setSelectedTableOrdersLoading(false);
    }
  };

  const getInvoiceItems = (invoice) => {
    if (!invoice) return [];
    if (invoice.orders) {
      return invoice.orders.flatMap((order) =>
        (order.items || []).map((item) => ({
          id: item._id || item.id,
          name: item.foodId?.name || item.name || "Item",
          quantity: item.quantity,
          unitPrice: item.foodId?.price ?? (item.total / item.quantity) ?? 0,
          total: item.total ?? (item.quantity * (item.foodId?.price ?? 0)),
        }))
      );
    }
    return (invoice.items || []).map((item) => ({
      id: item._id || item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.total / item.quantity,
      total: item.total,
    }));
  };

  const getInvoiceTotal = (invoice) => {
    if (!invoice) return 0;
    return invoice.totalAmount ?? invoice.grandTotal ?? invoice.orderTotal ?? invoice.amount ?? 0;
  };

  const getInvoiceTableNumber = (invoice) => {
    return invoice.tableId?.tableNumber ?? selectedTable?.number;
  };

  const getInvoiceCustomer = (invoice) => {
    if (!invoice) return t("Guest");
    const customerFromOrder = invoice.orders?.find((order) => order.customer)?.customer;
    return customerFromOrder || invoice.customer || invoice.customerName || t("Guest");
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await get("/api/v1/tables/all");
        const backendTables = res.data.data || [];
        setTables(backendTables.map((tbl) => ({
          id: tbl._id,
          number: tbl.tableNumber,
          isOccupied: tbl.isOccupied,
          orders: [],
        })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchTables();
  }, []);

  const handleGenerateInvoice = async (order) => {
    try {
      const res = await get(`/api/v1/bill/generate/${order._id ?? order.id}`);
      const bill = res.data.data;
      setSelectedInvoice(bill);

      const remainingOrders = await fetchTableOrders(selectedTable.id);
      setSelectedTable((prev) => ({ ...prev, orders: remainingOrders }));
      setTables((prev) =>
        prev.map((table) =>
          table.id === selectedTable.id
            ? { ...table, isOccupied: remainingOrders.length > 0 }
            : table
        )
      );
      setTimeout(() => window.print(), 400);
    } catch (error) {
      console.error(error);
      alert(t("InvoiceGenerationFailed"));
    }
  };

  const handleInvoicePaid = () => {
    setSelectedInvoice(null);
    setSelectedTable(null);
  };

  const invoiceDate = new Date().toLocaleDateString(i18n.language, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-4">
      {!selectedInvoice && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((tableData) => {
            const hasOrders = tableData.isOccupied || (tableData.orders?.length > 0);
            return (
              <div
                key={tableData.number}
                onClick={() => handleSelectTable(tableData)}
                className="erp-panel p-5 cursor-pointer hover:shadow-md transition-shadow relative"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleSelectTable(tableData)}
              >
                <div className="flex justify-center mb-3"><FaChair className="text-4xl text-slate-600" /></div>
                <h2 className="text-lg font-semibold text-center">{t("TableWithNumber", { number: tableData.number })}</h2>
                <div className="mt-2 flex justify-center items-center gap-2 text-sm">
                  {hasOrders ? (
                    <><FaClock className="text-amber-600" /><span>{t("InUse")}</span></>
                  ) : (
                    <><FaCheckCircle className="text-green-600" /><span>{t("Free")}</span></>
                  )}
                </div>
                <FaUtensils className="absolute top-3 right-3 text-slate-400" />
              </div>
            );
          })}
        </div>
      )}

      {selectedTable && !selectedInvoice && (
        <div className="modal-backdrop p-4 no-print" onClick={() => setSelectedTable(null)}>
          <div className="modal-card modal-card-lg p-6 w-full overflow-y-auto max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-button" onClick={() => setSelectedTable(null)} aria-label={t("Close")}>
              <AiOutlineClose size={18} />
            </button>
            <h2 className="erp-page-title mb-4">{t("TableWithNumber", { number: selectedTable.number })}</h2>

            {selectedTableOrdersLoading ? (
              <p className="text-slate-500 text-center py-8">{t("Loading")}</p>
            ) : selectedTable.orders.length === 0 ? (
              <p className="text-slate-500 text-center py-8">{t("NoOrdersFound")}</p>
            ) : (
              selectedTable.orders.map((o, i) => (
                <div key={o._id || o.id || i} className="erp-panel p-4 mb-4 border border-slate-200">
                  <div className="flex justify-between mb-3 items-center">
                    <h3 className="font-semibold">{o.customer || t("Customer")} {i + 1}</h3>
                    <span className="font-semibold text-red-600">${o.totalAmount ?? o.orderTotal ?? o.amount ?? 0}</span>
                  </div>
                  <div className="erp-table-wrap">
                    <table className="erp-table">
                      <thead><tr><th>{t("Food")}</th><th>{t("Qty")}</th><th>{t("Total")}</th></tr></thead>
                      <tbody>
                        {o.items.map((it) => {
                          const itemName = it.foodId?.name || it.name || "Item";
                          const itemTotal = it.total ?? (it.quantity * (it.foodId?.price ?? 0));
                          return (
                            <tr key={it._id || it.id}>
                              <td>{itemName}</td><td>{it.quantity}</td><td>${itemTotal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <Button onClick={() => handleGenerateInvoice(o)} variant="primary" className="w-full mt-3 flex items-center justify-center gap-2">
                    <FaPrint size={14} />
                    {t("GenerateInvoice")}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="invoice-container">
          <div className="print-area invoice-document">
            <header className="invoice-header">
              <div className="invoice-brand">
                <img src={Logo} alt={t("RestaurantName")} className="invoice-logo" />
                <div>
                  <h1 className="invoice-company">{t("RestaurantName")}</h1>
                  <p className="invoice-tagline">{t("RestaurantManagement")}</p>
                </div>
              </div>
              <div className="invoice-meta">
                <h2 className="invoice-title">{t("Invoice")}</h2>
                <p className="invoice-date">{invoiceDate}</p>
              </div>
            </header>

            <div className="invoice-info-grid">
              <div>
                <span className="invoice-label">{t("Customer")}</span>
                <p className="invoice-value">{getInvoiceCustomer(selectedInvoice)}</p>
              </div>
              <div>
                <span className="invoice-label">{t("Table")}</span>
                <p className="invoice-value">{getInvoiceTableNumber(selectedInvoice)}</p>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("Name")}</th>
                  <th>{t("Quantity")}</th>
                  <th>{t("Price")}</th>
                  <th>{t("Total")}</th>
                </tr>
              </thead>
              <tbody>
                {getInvoiceItems(selectedInvoice).map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.unitPrice).toFixed(2)}</td>
                    <td>${Number(item.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-total-row">
              <span>{t("Total")}</span>
              <span className="invoice-total-amount">
                {t("CurrencySymbol")}{Number(getInvoiceTotal(selectedInvoice)).toFixed(2)}
              </span>
            </div>

            <footer className="invoice-footer">
              <p>{t("ThankYouMessage")}</p>
            </footer>
          </div>

          <div className="invoice-actions no-print">
            <Button onClick={() => window.print()} variant="primary" className="flex items-center gap-2">
              <FaPrint size={14} />
              {t("PrintInvoice")}
            </Button>
            <Button onClick={handleInvoicePaid} variant="secondary">
              {t("PaidInvoice")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;
