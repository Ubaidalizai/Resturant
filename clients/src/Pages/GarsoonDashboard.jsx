// GarsoonDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FoodGrid from "../Components/garson/FoodGrid";
import CartPanel from "../Components/garson/CartPanel";
import OrderCard from "../Components/garson/OrderCard";
import LanguageSwitcher from "../Components/UI/LanguageSwitcher";
import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";
import Button from "../Components/UI/Button";
import InputField from "../Components/UI/InputField";
import { ItemsContext } from "../App";

function GarsoonDashboard() {
  const { get } = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { setIsAuth, setUser } = useContext(ItemsContext);

  const [menus, setMenus] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [tables, setTables] = useState([]);
  const [customer, setCustomer] = useState("");

  const [selectedMenu, setSelectedMenu] = useState("all");
  const [cart, setCart] = useState({});
  const [selectedTable, setSelectedTable] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersView, setOrdersView] = useState(false);
  const [foodSearch, setFoodSearch] = useState("");
  const [foodResetKey, setFoodResetKey] = useState(0);
  const { user } = useContext(ItemsContext);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const handleLogout = async () => {
    try {
      await get("/api/v1/user/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsAuth?.(false);
      setUser?.(null);
      navigate("/");
    }
  };

  const refreshFoods = () => {
    get("/api/v1/foods/all")
      .then((res) => setAllFoods(res.data.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    get("/api/v1/tables/all")
      .then((res) => setTables(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    get("/api/v1/menues/all")
      .then((res) => setMenus(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    refreshFoods();
  }, []);

  const filteredFoods = (selectedMenu && selectedMenu !== "all"
    ? allFoods.filter((food) => food.catagory === selectedMenu)
    : allFoods
  ).filter((food) =>
    !foodSearch.trim() || food.name.toLowerCase().includes(foodSearch.trim().toLowerCase())
  );

  const fetchOrders = async () => {
    try {
      const res = await get("/api/v1/orders/user", { withCredentials: true });
      setOrders(res.data.data);
      setOrdersView(true);
    } catch (err) {
      toast.error(t("ErrorFetchingOrders"));
    }
  };

  const loadOrderToCart = (order) => {
    const orderItems = order.items.reduce((acc, item) => {
      if (item.foodId) {
        acc[item.foodId._id] = { ...item.foodId, qty: item.quantity };
      }
      return acc;
    }, {});

    setCart(orderItems);
    setSelectedTable(order.tableId?._id || "");
    setCurrentOrderId(order._id);
    setCustomer(order.customer || "");
    setOrdersView(false);
  };

  const handleOrderPlaced = () => {
    setFoodResetKey((k) => k + 1);
    refreshFoods();
  };

  const canAccess = user?.permissions?.some((p) =>
    ["admin_access", "garson_access", "table_access", "order_food"].includes(p)
  );

  if (!canAccess) return null;

  return (
    <div className="garson-layout min-h-screen bg-[var(--erp-bg)] flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="erp-topbar garson-topbar flex-wrap gap-2">
          <div className="flex gap-3 items-center flex-wrap flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="erp-label mb-0 shrink-0">{t("Category", { defaultValue: "Category" })}</label>
              <select
                className="erp-select w-full sm:w-48"
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value)}
              >
                <option value="all">{t("AllFoods", { defaultValue: "All Foods" })}</option>
                {menus.map((menu) => (
                  <option key={menu._id} value={menu._id}>{menu.name}</option>
                ))}
              </select>
            </div>
            <Button onClick={fetchOrders} variant="primary" className="text-sm px-4 py-2">
              {t("Orders")}
            </Button>
            {ordersView && (
              <Button onClick={() => setOrdersView(false)} variant="secondary" className="text-sm px-4 py-2">
                {t("BackToMenu")}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher variant="inline" />
            <Button onClick={handleLogout} variant="secondary" className="text-sm px-4 py-2">
              {t("Logout")}
            </Button>
          </div>
        </header>

        <div className="p-4 flex-1 overflow-auto">
          {ordersView ? (
            <div className="flex gap-4 flex-wrap">
              {orders.length === 0 ? (
                <p className="text-slate-500">{t("NoOrdersForToday")}</p>
              ) : (
                orders.map((order) => {
                  const tableNumber = order.tableId?.tableNumber || t("NotAvailable", { defaultValue: "N/A" });
                  const itemNames = order.items
                    .filter((i) => i.foodId)
                    .map((i) => i.foodId.name)
                    .join(", ");
                  const total = order.totalAmount || 0;

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
            <>
              <div className="mb-4 max-w-sm">
                <InputField
                  type="text"
                  placeholder={t("SearchFood", { defaultValue: "Search food by name..." })}
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                />
              </div>
              <FoodGrid
                foods={filteredFoods}
                cart={cart}
                setCart={setCart}
                resetKey={foodResetKey}
              />
            </>
          )}
        </div>
      </div>

      <CartPanel
        cart={cart}
        setCart={setCart}
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        currentOrderId={currentOrderId}
        setCurrentOrderId={setCurrentOrderId}
        customer={customer}
        setCustomer={setCustomer}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  );
}

export default GarsoonDashboard;
