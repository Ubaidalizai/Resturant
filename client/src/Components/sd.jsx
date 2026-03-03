import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";

function LunchAndDinner() {
  const [foods, setFoods] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});
  const [table, setTable] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTableLocked, setEditTableLocked] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("FoodData");
    if (data) setFoods(JSON.parse(data));
  }, []);

  const increase = (id) => setQuantities((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));
  const decrease = (id) => setQuantities((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  const toggleCart = (food) => {
    const qty = quantities[food.id] || 1;
    setCart((p) => {
      if (p[food.id]) {
        const copy = { ...p };
        delete copy[food.id];
        return copy;
      }
      return { ...p, [food.id]: { ...food, qty } };
    });
  };

  const deleteItem = (id) => {
    setCart((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });
  };

  const openOrderModal = () => {
    if (!Object.keys(cart).length) return toast.error("No food added");
    setShowOrderModal(true);
  };

  const confirmOrder = () => {
    if (!table) return toast.error("Select table number");

    const items = Object.values(cart).map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: i.price,
      quantity: i.qty,
      total: i.price * i.qty,
    }));

    if (!items.length) return toast.error("No items in cart");

    let orders = JSON.parse(localStorage.getItem("Orders")) || [];

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      table,
      items,
      orderTotal: items.reduce((s, i) => s + i.total, 0),
    };

    orders.push(newOrder);
    localStorage.setItem("Orders", JSON.stringify(orders));
    toast.success("Order placed ✅");

    setCart({});
    setQuantities({});
    setTable("");
    setShowOrderModal(false);
  };

  const openEditOrder = () => {
    if (!editTableLocked) {
      setCart({});
      setQuantities({});
      setTable("");
    }
    setShowEditModal(true);
  };

  const handleTableSelectEdit = (t) => {
    setTable(t);
    const orders = JSON.parse(localStorage.getItem("Orders")) || [];
    const found = orders.find((o) => o.table === t);
    if (!found) return toast.error("No order found for this table");

    const newCart = {};
    const newQty = {};
    found.items.forEach((i) => {
      newCart[i.id] = { ...i, qty: i.quantity };
      newQty[i.id] = i.quantity;
    });

    setCart(newCart);
    setQuantities(newQty);
    setEditTableLocked(true);
  };

  const updateOrder = () => {
    if (!table) return toast.error("Select table number");

    const items = Object.values(cart).map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: i.price,
      quantity: i.qty,
      total: i.price * i.qty,
    }));

    if (!items.length) return toast.error("No items in cart");

    let orders = JSON.parse(localStorage.getItem("Orders")) || [];
    const index = orders.findIndex((o) => o.table === table && o.id === cart[Object.keys(cart)[0]].id);

    const updatedOrder = {
      id: index !== -1 ? orders[index].id : Date.now(),
      date: new Date().toLocaleDateString(),
      table,
      items,
      orderTotal: items.reduce((s, i) => s + i.total, 0),
    };

    if (index !== -1) orders[index] = updatedOrder;
    else orders.push(updatedOrder);

    localStorage.setItem("Orders", JSON.stringify(orders));
    toast.success("Order updated ✅");

    setCart({});
    setQuantities({});
    setTable("");
    setEditTableLocked(false);
    setShowEditModal(false);
  };

  const lunchAndDinnerFoods = foods.filter(f => f.category === "Lunch" || f.category === "Dinner");
  const grandTotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 px-4 pb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <Link to="/" className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-600">Lunch & Dinner</Link>

        <div className="flex items-center gap-4">
          <select value={table} onChange={(e) => setTable(e.target.value)} className="px-4 py-2 rounded-xl text-white bg-yellow-600">
            <option value="">Select Table</option>
            {[1,2,3,4,5,6].map((t) => <option key={t} value={t}>Table {t}</option>)}
          </select>

          <button onClick={openOrderModal} className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold">
            Order ({Object.keys(cart).length})
          </button>

          <button onClick={openEditOrder} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
            Edit Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {lunchAndDinnerFoods.map((food) => (
          <div key={food.id} className="bg-white rounded-xl p-4 flex flex-col gap-4 shadow hover:shadow-lg">
            <img src={food.image} alt={food.name} className="h-40 w-full object-cover rounded-lg border border-dashed border-yellow-600"/>
            <h2 className="font-semibold text-gray-800">{food.name}</h2>
            <p className="text-yellow-600 font-medium">${food.price}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => decrease(food.id)} className="w-8 h-8 border rounded border-yellow-500 text-yellow-600">−</button>
                <span className="text-yellow-600">{quantities[food.id] || 1}</span>
                <button onClick={() => increase(food.id)} className="w-8 h-8 border rounded border-yellow-500 text-yellow-600">+</button>
              </div>

              <button onClick={() => toggleCart(food)} className={`px-4 py-2 rounded font-semibold text-sm ${cart[food.id] ? "bg-green-500 text-white" : "bg-yellow-600 text-white"}`}>
                {cart[food.id] ? "Added ✓" : "Add"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Order Details</h2>

            <table className="w-full border text-black">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-2">Food</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(cart).map(item => (
                  <tr key={item.id} className="text-center border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">${item.price}</td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">${item.price * item.qty}</td>
                    <td className="p-2">
                      <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center gap-1 text-red-600">
                        <AiOutlineDelete /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <h3 className="font-bold text-lg text-red-600">Grand Total: ${grandTotal}</h3>
            </div>

            <div className="flex justify-between items-center mt-6 gap-4">
              <select value={table} onChange={(e) => setTable(e.target.value)} className="px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold">
                <option value="">Select Table</option>
                {[1,2,3,4,5,6].map(t => <option key={t} value={t}>Table {t}</option>)}
              </select>

              <div className="flex gap-4">
                <button onClick={() => setShowOrderModal(false)} className="px-4 py-2 border rounded flex items-center gap-2 text-black">
                  <AiOutlineDelete /> Cancel
                </button>

                <button onClick={confirmOrder} className="bg-green-600 text-white px-6 py-2 rounded-xl">Confirm Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Edit Order</h2>

            {!editTableLocked && (
              <select value={table} onChange={(e) => handleTableSelectEdit(e.target.value)} className="mb-4 px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold">
                <option value="">Select Table</option>
                {[1,2,3,4,5,6].map(t => <option key={t} value={t}>Table {t}</option>)}
              </select>
            )}

            <table className="w-full border text-black">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-2">Food</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(cart).map(item => (
                  <tr key={item.id} className="text-center border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">${item.price}</td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">${item.price * item.qty}</td>
                    <td className="p-2">
                      <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center gap-1 text-red-600">
                        <AiOutlineDelete /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <h3 className="font-bold text-lg text-red-600">Grand Total: ${grandTotal}</h3>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setShowEditModal(false)} className="bg-yellow-600 text-white px-4 py-2 rounded-xl">Foods</button>
              <button onClick={updateOrder} className="bg-green-600 text-white px-6 py-2 rounded-xl">Update</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LunchAndDinner;
