import axios from "axios";
import TableSelector from "./TableSelector";
import { baseURL } from "../../configs/baseURL.config";

function CartPanel({ cart, setCart, tables, selectedTable, setSelectedTable }) {
  const items = Object.values(cart);
  const grandTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const removeItem = (id) => {
    const copy = { ...cart };
    delete copy[id];
    setCart(copy);
  };

  const confirmOrder = async () => {
    if (!selectedTable) {
      alert("Select a table first");
      return;
    }

    if (items.length === 0) {
      alert("Add some food first");
      return;
    }

    try {
      // 🔹 Map items to match backend validation
      const orderItems = items.map(item => ({
        foodId: item._id,
        quantity: item.qty, // matches backend validation
      }));

      // 🔹 Post order to backend
      const res = await axios.post(`${baseURL}/api/v1/orders/add`, {
        tableId: selectedTable,
        items: orderItems
      });

      console.log("Order added:", res.data);
      alert("Order placed successfully!");

      // 🔹 Clear cart and table selection
      setCart({});
      setSelectedTable("");
    } catch (err) {
      console.error("Error adding order:", err);
      alert("Error placing order, try again.");
    }
  };

  return (
    <div className="sticky top-0 h-screen w-full md:w-80 bg-gray-50 shadow-xl p-6 flex flex-col">
      {/* Header */}
      <h2 className="text-2xl font-bold text-yellow-600 mb-4">Cart</h2>

      {/* Table Selector */}
      <TableSelector
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />

      {/* Items List */}
      <div className="flex-1 overflow-y-auto mb-4">
        {items.length === 0 ? (
          <p className="text-gray-500">No items in cart</p>
        ) : (
          items.map(item => (
            <div key={item._id} className="flex justify-between items-center mb-3 bg-white p-2 rounded shadow-sm">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-yellow-600">${item.price} x {item.qty}</p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-600 font-bold"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer / Total */}
      <div className="mt-auto">
        <h3 className="font-bold text-lg text-red-600 mb-4">Total: ${grandTotal}</h3>
        <button
          onClick={confirmOrder}
          className="w-full bg-green-600 text-white py-2 rounded-xl font-bold"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default CartPanel;