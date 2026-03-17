// GarsoonDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MenuTabs from "../Components/garson/MenuTabs";
import FoodGrid from "../Components/garson/FoodGrid";
import CartPanel from "../Components/garson/CartPanel";
import OrderCard from "../Components/garson/OrderCard";
import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";
import Button from "../Components/UI/Button";
import { ItemsContext } from "../App";
function GarsoonDashboard() {

  const { get } = useApi();
  const { t } = useTranslation("common");

  const [menus, setMenus] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [tables, setTables] = useState([]);
  const [customer, setCustomer] = useState('');

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cart, setCart] = useState({});
  const [selectedTable, setSelectedTable] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersView, setOrdersView] = useState(false);
  const {user} = useContext(ItemsContext);
  // Track current editing order
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    get('/api/v1/tables/all')
      .then((res) => setTables(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    get('/api/v1/menues/all')
      .then((res) => {
        setMenus(res.data.data);
        if (res.data.data.length)
          setSelectedMenu(res.data.data[0]._id);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    get('/api/v1/foods/all')
      .then((res) => setAllFoods(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredFoods = selectedMenu
    ? allFoods.filter((food) => food.catagory === selectedMenu)
    : allFoods;

  const fetchOrders = async () => {
    try {

      const res = await get('/api/v1/orders/user', {
        withCredentials: true,
      });

      setOrders(res.data.data);
      setOrdersView(true);

    } catch (err) {
      toast.error(t("ErrorFetchingOrders"));
    }
  };

  const loadOrderToCart = (order) => {

    const orderItems = order.items.reduce((acc, item) => {

      if (item.foodId) {
        acc[item.foodId._id] = {
          ...item.foodId,
          qty: item.quantity
        };
      }

      return acc;

    }, {});

    setCart(orderItems);
    setSelectedTable(order.tableId?._id || "");
    setCurrentOrderId(order._id);

    // Load customer name when editing
    setCustomer(order.customer || "");

    setOrdersView(false);
  };
    // CHECK PERMISSIONS
  const canAccess = user?.permissions?.some(p =>
    ["admin_access", "garson_access"].includes(p)
  );

  if (!canAccess) return <></>;
  return (
    <div className="min-h-screen bg-gray-100 flex">

      <div className="flex-1 p-6">

        <div className="flex gap-4 items-center mb-6 flex-wrap">

          <MenuTabs
            menus={menus}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />

          <Button
            onClick={fetchOrders}
            className="px-6 py-2.5 relative -top-3 bg-yellow-500"
          >
            {t("Orders")}
          </Button>

          {ordersView && (
            <Button
              onClick={() => setOrdersView(false)}
              className="px-6 py-2.5 relative -top-3 bg-gray-300 text-black"
            >
              {t("BackToMenu")}
            </Button>
          )}

        </div>

        {ordersView ? (

          <div className="flex gap-4 flex-wrap">

            {orders.length === 0 ? (
              <p className="text-gray-500">
                {t("NoOrdersForToday")}
              </p>
            ) : (

              orders.map((order) => {

                const tableNumber =
                  order.tableId?.tableNumber || t("NotAvailable", { defaultValue: "N/A" });

                const itemNames = order.items
                  .filter((i) => i.foodId)
                  .map((i) => i.foodId.name)
                  .join(", ");

                const total =
                  order.totalAmount || 0;

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

          <FoodGrid
            foods={filteredFoods}
            cart={cart}
            setCart={setCart}
          />

        )}

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
      />

    </div>
  );
}

export default GarsoonDashboard;