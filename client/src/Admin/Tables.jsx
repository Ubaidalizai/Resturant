import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../configs/baseURL.config";
import { FaUtensils, FaChair, FaClock, FaCheckCircle } from "react-icons/fa"; // Icons

function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/v1/tables/all`);
        const backendTables = res.data.data || [];
        const orders = JSON.parse(localStorage.getItem("Orders")) || [];

        const grouped = backendTables.map((t) => ({
          number: t.tableNumber,
          orders: orders.filter((o) => o.table === String(t.tableNumber)),
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

  const handleGenerateInvoice = (order) => {
    setSelectedInvoice(order);

    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">

      {!selectedInvoice && (
        <>
          <h1 className="text-4xl font-extrabold text-yellow-600 text-center mb-8">
            Tables
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((t) => {
              const hasOrders = t.orders.length > 0;

              return (
                <div
                  key={t.number}
                  onClick={() => setSelectedTable(t)}
                  className="relative cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white rounded-3xl border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-center items-center mb-4">
                      <FaChair className="text-5xl text-yellow-500" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 text-center">
                      Table {t.number}
                    </h2>

                    {/* Modern status indicator without harsh colors */}
                    <div className="mt-3 flex justify-center items-center space-x-2 text-gray-700">
                      {hasOrders ? (
                        <>
                          <FaClock className="text-yellow-500 text-lg" />
                          <span className="text-md font-medium">In Use</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="text-yellow-600 text-lg" />
                          <span className="text-md font-medium">Free</span>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            {/* unchanged modal content */}
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold text-yellow-600">
                Table {selectedTable.number}
              </h2>
              <button
                onClick={() => setSelectedTable(null)}
                className="font-bold text-yellow-600 text-xl"
              >
                X
              </button>
            </div>

            {selectedTable.orders.map((o, i) => (
              <div
                key={o.id}
                className="border rounded-2xl p-4 bg-yellow-50 shadow-md mb-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-3 items-center">
                  <h3 className="font-bold text-lg text-yellow-600">
                    Customer {i + 1}
                  </h3>
                  <span className="font-bold text-red-600">${o.orderTotal}</span>
                </div>

                <div className="overflow-x-auto text-black">
                  <table className="w-full border-collapse text-center">
                    <thead className="bg-yellow-100">
                      <tr>
                        <th className="py-2">Food</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.map((it) => (
                        <tr key={it.id} className="border-t hover:bg-yellow-200">
                          <td className="py-2">{it.name}</td>
                          <td className="py-2">{it.quantity}</td>
                          <td className="py-2">${it.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => handleGenerateInvoice(o)}
                  className="w-full mt-3 bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700 transition"
                >
                  Generate Invoice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="print-area bg-white p-10 text-black">
          {/* unchanged invoice UI */}
          <h2 className="text-3xl font-bold text-center mb-4">Invoice</h2>
          <p className="text-center">Table {selectedTable.number}</p>
          <p className="text-center mb-6">{new Date().toLocaleDateString()}</p>

          <table className="w-full border-collapse text-center border">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">${item.total}</td>
                  <td className="border p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-6 font-bold text-xl">
            Total: ${selectedInvoice.orderTotal}
          </div>

          <button
            onClick={() => deleteOrderById(selectedInvoice.id)}
            className="mt-6 bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
          >
            Paid Invoice
          </button>
        </div>
      )}

    </div>
  );
}

export default Tables;