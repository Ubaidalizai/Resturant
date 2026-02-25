import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";


function BrekFast() {
  const [foods, setFoods] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});
  const [table, setTable] = useState(null);
  const [tables, setTables] = useState([]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTableLocked, setEditTableLocked] = useState(false);

  
  useEffect(() => {
  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/foods/all");

    
      const allFoods = res.data.data || [];

     
      const formattedFoods = allFoods.map((f) => ({
        ...f,
        id: f._id,
      }));

      setFoods(formattedFoods);

      console.log(formattedFoods);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch foods");
    }
  };

  fetchFoods();
}, []);


  // ✅ Fetch Tables (نوې برخه)
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/tables/all");
        console.log("TABLE API RESPONSE:", res.data);
        setTables(res.data.data || []);
      } catch (err) {
        toast.error('Table is not loaded');
      }
    };
    fetchTables();
  }, []);

  const increase = (id) =>
    setQuantities((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

  const decrease = (id) =>
    setQuantities((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

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
    if (!Object.keys(cart).length) {
      toast.error("No food added");
      return;
    }
    setShowOrderModal(true);
  };

  const grandTotal = Object.values(cart).reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  // ✅ CONFIRM ORDER → DATABASE
  const confirmOrder = async () => {
  if (!table) {
    toast.error("Select table number");
    return;
  }

  const items = Object.values(cart).map((i) => ({
    foodId: i.id,
    quantity: i.qty,
  }));

  if (!items.length) {
    toast.error("No items in cart");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:4000/api/v1/orders/add",
      {
        tableId: table,
        items
      }
    );

    if (res.data.success) {
      toast.success("Order placed ✅");
      setCart({});
      setQuantities({});
      setTable(null);
      setShowOrderModal(false);
    } else {
      toast.error(res.data.message || "Order failed");
    }
  } catch (err) {
    toast.error("Server error while placing order" || res.err.message);
  }
  console.log(res)
};

  const openEditOrder = () => {
    if (!editTableLocked) {
      setCart({});
      setQuantities({});
      setTable("");
    }
    setShowEditModal(true);
  };

  // ✅ LOAD ORDER FROM DATABASE
  const handleTableSelectEdit = async (tableId) => {
    setTable(tableId);

    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/orders/table/${tableId}`
      );

      if (!res.data.success) {
        toast.error("No order found for this table");
        return;
      }

      const order = res.data.data;
      setCurrentOrderId(order._id);

      const newCart = {};
      const newQty = {};

      order.items.forEach((i) => {
        newCart[i.food] = {
          id: i.food,
          name: i.name,
          price: i.price,
          qty: i.quantity,
        };
        newQty[i.food] = i.quantity;
      });

      setCart(newCart);
      setQuantities(newQty);
      setEditTableLocked(true);
    } catch (err) {
      toast.error("Error loading order");
    }
  };

  // ✅ UPDATE ORDER → DATABASE
  const updateOrder = async () => {
    if (!table || !currentOrderId) {
      toast.error("Select table number");
      return;
    }

    const items = Object.values(cart).map((i) => ({
      food: i.id,
      name: i.name,
      price: i.price,
      quantity: i.qty,
    }));

    if (!items.length) {
      toast.error("No items in cart");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/orders/update/${currentOrderId}`,
        {
          table,
          items,
          totalAmount: grandTotal,
        }
      );

      if (res.data.success) {
        toast.success("Order updated ✅");
        setCart({});
        setQuantities({});
        setTable("");
        setEditTableLocked(false);
        setShowEditModal(false);
        setCurrentOrderId(null);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Server error while updating order");
    }
  };

  const breakfastFoods = foods.filter(
    (f) => f.catagory?.toLowerCase() === "breakfast");
  return (
    <div className="min-h-screen bg-gray-100 px-4 pb-10">

      {/* Header */}
  
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
       
        <div className="flex items-center gap-4">
          <Link to="/menus" className="text-black flex items-center gap-2 px-4 py-2 rounded-xl   border border-gray-300 bg-white hover:bg-gray-100 transition shadow-sm font-semibold"> Back </Link> 
          <Link to="/" className="text-3xl sm:text-4xl font-bold text-yellow-600"> Breakfast </Link>
        </div>

        <div className="flex gap-4">
          {/* Order Button */}
          <button
            onClick={openOrderModal}
            className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Order ({Object.keys(cart).length})
          </button>

          {/* Edit Button */}
          <button
            onClick={openEditOrder}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Order Edit
          </button>
        </div>
      </div>
    
      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {breakfastFoods.map((food) => (
          <div key={food.id} className="bg-white rounded-xl p-4 shadow">
            <img src={`http://localhost:4000${food.image}`} alt={food.name} className="h-40 w-full object-cover rounded-lg border-[2.5px] border-yellow-600 border-dotted" />
            <h2 className="font-semibold text-black">{food.name}</h2>
            <p className="text-yellow-600">${food.price}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button className="w-8 h-8 border rounded border-yellow-500 text-yellow-600" onClick={() => decrease(food.id)}>−</button>
                <span className="text-yellow-600">{quantities[food.id] || 1}</span>
                <button className="w-8 h-8 border rounded border-yellow-500 text-yellow-600" onClick={() => increase(food.id)}>+</button>
              </div>

              <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold text-sm" onClick={() => toggleCart(food)}>
                {cart[food.id] ? "Added ✓" : "Add"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*ORDER MODAL*/}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Order Details</h2>

            {/* Table of Selected Foods */}
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
                {Object.values(cart).map((item) => (
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

            {/* Grand Total */}
            <div className="flex justify-end items-center mt-4">
              <h3 className="font-bold text-lg text-red-600">Grand Total: ${grandTotal}</h3>
            </div>

            {/* Table Selection & Buttons */}
            <div className="flex justify-between items-center mt-6 gap-4">
              <select value={table || ""} onChange={(e) => setTable(e.target.value)} className="px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold">
                <option value="">Select Table</option>
                {tables.map((t, i) => (
                    <option key={t._id || i} value={t._id}>
                      Table {t.tableNumber || t.number || i + 1}
                    </option>
                  ))}
              </select>

              <div className="flex gap-4">
                <button onClick={() => setShowOrderModal(false)} className="px-4 py-2 border rounded flex items-center gap-2 text-black">
                  <AiOutlineDelete /> Cancel
                </button>

                <button onClick={confirmOrder} className="bg-green-600 text-white px-6 py-2 rounded-xl">
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*EDIT MODAL*/}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Edit Order</h2>

            {/* Table Selection if not locked */}
            {!editTableLocked && (
              <select value={table} onChange={(e) => handleTableSelectEdit(e.target.value)} className="mb-4 px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold">
                <option value="">Select Table</option>
                {[1, 2, 3, 4, 5, 6].map((t) => (
                  <option key={t} value={String(t)}>Table {t}</option>
                ))}
              </select>
            )}

            {/* Table of Foods */}
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
                {Object.values(cart).map((item) => (
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

            {/* Grand Total */}
            <div className="flex justify-end items-center mt-4">
              <h3 className="font-bold text-lg text-red-600">Grand Total: ${grandTotal}</h3>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setShowEditModal(false)} className="bg-yellow-600 text-white px-4 py-2 rounded-xl">
                Foods
              </button>

              <button onClick={updateOrder} className="bg-green-600 text-white px-6 py-2 rounded-xl">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrekFast;



