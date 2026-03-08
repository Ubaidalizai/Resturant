// GarsoonDashboard.jsx
import { useEffect, useState } from "react";
import MenuTabs from "../Components/garson/MenuTabs";
import FoodGrid from "../Components/garson/FoodGrid";
import CartPanel from "../Components/garson/CartPanel";
import OrderCard from "../Components/garson/OrderCard";
import axios from "axios";
import { baseURL } from "../configs/baseURL.config";
import { toast } from "react-toastify";

function GarsoonDashboard() {
  const [menus, setMenus] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [tables, setTables] = useState([]);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cart, setCart] = useState({});
  const [selectedTable, setSelectedTable] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersView, setOrdersView] = useState(false);

  // Track current editing order
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Fetch tables
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/tables/all`)
      .then((res) => setTables(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch menus
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/menues/all`)
      .then((res) => {
        setMenus(res.data.data);
        if (res.data.data.length) setSelectedMenu(res.data.data[0]._id);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch foods
  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/foods/all`)
      .then((res) => setAllFoods(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter foods by selected menu
  const filteredFoods = selectedMenu
    ? allFoods.filter((food) => food.catagory === selectedMenu)
    : allFoods;

  // Fetch today's orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/orders/user`, {
        withCredentials: true,
      });
      setOrders(res.data.data);
      setOrdersView(true);
    } catch (err) {
      toast.error("Error fetching orders");
    }
  };

  // Load an order into the cart for editing
  const loadOrderToCart = (order) => {
    // Include all items (not filtered by menu)
    const orderItems = order.items.reduce((acc, item) => {
      if (item.foodId) {
        acc[item.foodId._id] = { ...item.foodId, qty: item.quantity };
      }
      return acc;
    }, {});
    setCart(orderItems);
    setSelectedTable(order.tableId?._id || "");
    setCurrentOrderId(order._id);
    setOrdersView(false); // go back to menu view to add items
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* LEFT SIDE */}
      <div className="flex-1 p-6">
        <div className="flex gap-4 items-center mb-6 flex-wrap">
          <MenuTabs
            menus={menus}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />

          <button
            onClick={fetchOrders}
            className="px-6 py-2.5 relative -top-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Orders
          </button>

          {ordersView && (
            <button
              onClick={() => setOrdersView(false)}
              className="px-6 py-2.5 relative -top-3 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Back to Menu
            </button>
          )}
        </div>

        {/* Show either orders or foods */}
        {ordersView ? (
          <div className="flex gap-4 flex-wrap">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders for today</p>
            ) : (
              orders.map((order) => {
                // Use tableNumber from backend
                const tableNumber = order.tableId?.tableNumber || "N/A";
                // Safely map item names
                const itemNames = order.items
                  .filter((i) => i.foodId)
                  .map((i) => i.foodId.name)
                  .join(", ");
                const total = order.totalAmount || 0;
                  {console.log("Order items:", order.items, "Total:", total)}
                return (
                  <OrderCard
                    key={order._id}
                    order={{ ...order, tableNumber }}
                    itemNames={itemNames}
                    total={total}
                    loadOrderToCart={loadOrderToCart}
                  />
                );
              })
            )}
          </div>
        ) : (
          <FoodGrid foods={filteredFoods} cart={cart} setCart={setCart} />
        )}
      </div>

      {/* RIGHT SIDE CART */}
      <CartPanel
        cart={cart}
        setCart={setCart}
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        currentOrderId={currentOrderId}
        setCurrentOrderId={setCurrentOrderId}
      />
    </div>
  );
}

export default GarsoonDashboard;