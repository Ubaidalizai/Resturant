import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";
import { FaChair, FaCheckCircle, FaClock, FaUtensils } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Components/UI/Button";

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
          total: item.total ?? (item.quantity * (item.foodId?.price ?? 0)),
        }))
      );
    }
    return (invoice.items || []).map((item) => ({
      id: item._id || item.id,
      name: item.name,
      quantity: item.quantity,
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
    if (!invoice) return "Guest";
    const customerFromOrder = invoice.orders?.find((order) => order.customer)?.customer;
    return customerFromOrder || invoice.customer || invoice.customerName || "Guest";
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await get('/api/v1/tables/all');
        const backendTables = res.data.data || [];

        const grouped = backendTables.map((t) => ({
          id: t._id,
          number: t.tableNumber,
          isOccupied: t.isOccupied,
          orders: [],
        }));

        setTables(grouped);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTables();
  }, []);

  const deleteOrderById = (orderId) => {
    const updatedOrders = selectedTable.orders.filter((o) => o.id !== orderId);

    setSelectedTable({
      ...selectedTable,
      orders: updatedOrders,
    });

    setTables(
      tables.map((t) =>
        t.number === selectedTable.number
          ? { ...t, orders: updatedOrders }
          : t
      )
    );

    setSelectedInvoice(null);
  };

  const handleDeliveredToggle = (orderId) => {
    setSelectedTable({
      ...selectedTable,
      orders: selectedTable.orders.map((o) =>
        o.id === orderId ? { ...o, delivered: !o.delivered } : o
      ),
    });
  };

  const handleGenerateInvoice = async (order) => {
    try {
      const res = await get(`/api/v1/bill/generate/${order._id ?? order.id}`);
      const bill = res.data.data;
      setSelectedInvoice(bill);
      setTables(
        tables.map((table) =>
          table.id === selectedTable.id ? { ...table, isOccupied: false } : table
        )
      );
      setTimeout(() => {
        window.print();
      }, 300);
    } catch (error) {
      console.error(error);
      alert("Unable to generate bill. Please try again.");
    }
  };

  const handleInvoicePaid = () => {
    setSelectedInvoice(null);
    setSelectedTable(null);
  };

  return (
    <div className="p-6 bg-linear-to-b from-gray-50 to-gray-100 min-h-screen">

      {!selectedInvoice && (
        <>
          <h1 className="text-4xl font-extrabold text-yellow-600 text-center mb-8">
            {t("Tables", { defaultValue: "Tables" })}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((tableData) => {
              const hasOrders = tableData.isOccupied || (tableData.orders?.length > 0);

              return (
                <div
                  key={tableData.number}
                  onClick={() => handleSelectTable(tableData)}
                  className="relative cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white rounded-3xl border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-center items-center mb-4">
                      <FaChair className="text-5xl text-yellow-500" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 text-center">
                        {t("TableWithNumber", { defaultValue: "Table {{number}}", number: tableData.number })}
                      </h2>
                    {/* Modern status indicator without harsh colors */}
                    <div className="mt-3 flex justify-center items-center space-x-2 text-gray-700">
                      {hasOrders ? (
                        <>
                          <FaClock className="text-yellow-500 text-lg" />
                          <span className="text-md font-medium">{t("InUse", { defaultValue: "In Use" })}</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="text-yellow-600 text-lg" />
                          <span className="text-md font-medium">{t("Free", { defaultValue: "Free" })}</span>
                        </>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 text-gray-400 text-xl">
                      <FaUtensils />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TABLE MODAL and PRINT sections remain exactly the same */}
      {selectedTable && !selectedInvoice && (
        <div className="modal-backdrop p-4 no-print" onClick={() => setSelectedTable(null)}>
          <div className="modal-card w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            {/* unchanged modal content */}
            <button type="button" className="modal-close-button" onClick={() => setSelectedTable(null)}>
              <AiOutlineClose size={18} />
            </button>
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold text-yellow-600">
                {t("TableWithNumber", { number: selectedTable.number })}
              </h2>
            </div>

            {selectedTable.orders.map((o, i) => (
              <div
                key={o.id}
                className="border rounded-2xl p-4 bg-yellow-50 shadow-md mb-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-3 items-center">
                  <h3 className="font-bold text-lg text-yellow-600">
                    {t("Customer", { defaultValue: "Customer" })} {i + 1}
                  </h3>
                  <span className="font-bold text-red-600">
                    {t("CurrencySymbol", { defaultValue: "$" })}{o.totalAmount ?? o.orderTotal ?? o.amount ?? 0}
                  </span>
                </div>

                <div className="overflow-x-auto text-black">
                  <table className="w-full border-collapse text-center">
                    <thead className="bg-yellow-100">
                      <tr>
                        <th className="py-2">{t("Food", { defaultValue: "Food" })}</th>
                        <th className="py-2">{t("Qty", { defaultValue: "Qty" })}</th>
                        <th className="py-2">{t("Total", { defaultValue: "Total" })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.map((it) => {
                        const itemName = it.foodId?.name || it.name || "Item";
                        const itemTotal = it.total ?? (it.quantity * (it.foodId?.price ?? 0));
                        return (
                          <tr key={it._id || it.id} className="border-t hover:bg-yellow-200">
                            <td className="py-2">{itemName}</td>
                            <td className="py-2">{it.quantity}</td>
                            <td className="py-2">${itemTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Button
                  onClick={() => handleGenerateInvoice(o)}
                  className="w-full mt-3"
                >
                  {t("GenerateInvoice", { defaultValue: "Generate Invoice" })}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="print-area bg-white p-10 text-black">
          <h2 className="text-3xl font-bold text-center mb-4">{t("Invoice", { defaultValue: "Invoice" })}</h2>
          <p className="text-center">{t("Customer", { defaultValue: "Customer" })}: {getInvoiceCustomer(selectedInvoice)}</p>
          <p className="text-center">{t("Table", { defaultValue: "Table" })} {getInvoiceTableNumber(selectedInvoice)}</p>
          <p className="text-center mb-6">{new Date().toLocaleDateString(i18n.language || 'en-US')}</p>

          <table className="w-full border-collapse text-center border">
            <thead>
              <tr>
                <th className="border p-2">{t("Name")}</th>
                <th className="border p-2">{t("Amount")}</th>
                <th className="border p-2">{t("Quantity")}</th>
              </tr>
            </thead>
            <tbody>
              {getInvoiceItems(selectedInvoice).map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">${item.total}</td>
                  <td className="border p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-6 font-bold text-xl">
            {t("Total", { defaultValue: "Total" })}: {t("CurrencySymbol", { defaultValue: "$" })}{getInvoiceTotal(selectedInvoice)}
          </div>

          <Button
            onClick={handleInvoicePaid}
            className="mt-6 px-6 py-2"
          >
            {t("PaidInvoice", { defaultValue: "Paid Invoice" })}
          </Button>
        </div>
      )}

    </div>
  );
}

export default Tables;