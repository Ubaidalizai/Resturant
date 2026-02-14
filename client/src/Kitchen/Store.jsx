import React, { useEffect, useState } from "react";
import axios from "axios";

function Store() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // د API fetch مثال
    const fetchItems = async () => {
      try {
        // دلته د خپل API endpoint وکاروه
        // const response = await axios.get("/api/store");
        // dummy data for demo:
        const response = [
          { id: 1, name: "Tomatoes", quantity: 50, status: "Available" },
          { id: 2, name: "Cheese", quantity: 0, status: "Out of Stock" },
          { id: 3, name: "Burger Patties", quantity: 20, status: "Available" },
          { id: 4, name: "Pasta", quantity: 10, status: "Low Stock" },
        ];

        setItems(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Kitchen Store</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading store items...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500">No items in store.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transform transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 mb-1">Quantity: {item.quantity}</p>
              <p
                className={`font-semibold ${
                  item.status === "Available"
                    ? "text-green-600"
                    : item.status === "Low Stock"
                    ? "text-orange-500"
                    : "text-red-600"
                }`}
              >
                Status: {item.status}
              </p>
              <button
                className="mt-4 w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Update Stock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;
