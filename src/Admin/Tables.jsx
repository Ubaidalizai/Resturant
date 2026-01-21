import React, { useEffect, useState } from "react";

function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("Orders")) || [];
    const allTables = [1, 2, 3, 4, 5, 6];

    const grouped = allTables.map((t) => ({
      number: t,
      orders: orders.filter((o) => o.table === String(t)),
    }));

    setTables(grouped);
  }, []);

  
  const handlePaid = (orderId) => {
    setSelectedTable({
      ...selectedTable,
      orders: selectedTable.orders.filter((o) => o.id !== orderId),
    });

    setTables(
      tables.map((t) =>
        t.number === selectedTable.number
          ? { ...t, orders: t.orders.filter((o) => o.id !== orderId) }
          : t
      )
    );
  };

 
  const handleDeliveredToggle = (orderId) => {
    setSelectedTable({
      ...selectedTable,
      orders: selectedTable.orders.map((o) =>
        o.id === orderId ? { ...o, delivered: !o.delivered } : o
      ),
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-yellow-600 text-center mb-8">
        Tables
      </h1>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((t) => {
          const isOccupied = t.orders.length > 0;
          return (
            <div
              key={t.number}
              onClick={() => setSelectedTable(t)}
              className={`cursor-pointer bg-white p-6 rounded-2xl shadow-lg border-2 transform hover:scale-105 transition duration-300 ${
                isOccupied ? "border-yellow-600" : "border-green-500"
              }`}
            >
              <h2 className="text-2xl font-bold text-center text-yellow-600">
                Table {t.number}
              </h2>
              <p
                className={`text-center mt-2 font-semibold ${
                  isOccupied ? "text-red-500" : "text-green-500"
                }`}
              >
                {isOccupied ? "Occupied" : "Available"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Table Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-3xl font-bold text-yellow-600 text-center mb-6">
              Table {selectedTable.number}
            </h2>

            {selectedTable.orders.length === 0 && (
              <p className="text-center text-gray-500 font-semibold py-10">
                No orders yet.
              </p>
            )}

            {/* Orders Cards */}
            <div className="flex flex-col gap-4">
              {selectedTable.orders.map((o, i) => (
                <div
                  key={o.id}
                  className="border rounded-2xl p-4 bg-yellow-50 shadow-md"
                >
                  <div className="flex justify-between mb-3 items-center">
                    <h3 className="font-bold text-lg text-yellow-600">
                      Customer {i + 1}
                    </h3>

                    {/* ✅ Delivered Checkmark per customer */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={o.delivered || false}
                        onChange={() => handleDeliveredToggle(o.id)}
                      />
                      <span className="text-gray-700 font-medium">
                        Delivered
                      </span>
                    </div>

                    <span className="font-bold text-red-600">
                      ${o.orderTotal}
                    </span>
                  </div>

                  {/* Cart Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-center text-black">
                      <thead className="bg-yellow-100">
                        <tr>
                          <th className="py-2 px-3 font-semibold">Food</th>
                          <th className="py-2 px-3 font-semibold">Qty</th>
                          <th className="py-2 px-3 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {o.items.map((it) => (
                          <tr
                            key={it.id}
                            className="border-t last:border-b bg-white hover:bg-yellow-50 transition-colors"
                          >
                            <td className="py-2 px-3">{it.name}</td>
                            <td className="py-2 px-3">{it.quantity}</td>
                            <td className="py-2 px-3">${it.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paid button */}
                  <button
                    onClick={() => handlePaid(o.id)}
                    className="w-full mt-3 bg-yellow-600 text-white font-semibold py-2 rounded-xl hover:bg-yellow-500 transition-colors"
                  >
                    Paid
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedTable(null)}
              className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;
