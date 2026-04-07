import React, { useState, useEffect, useContext } from "react";
import { AiOutlineMenu, AiOutlineTable, AiOutlineAppstore, AiOutlineHistory } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBurger } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import Tables from "./Tables";
import OrderHistory from "./OrderHistory";
import FoodDataStorage from './FoodDataStorage';
import Logo from'../images/logo.jpg';
import OverviewChart from "./OverviewChart";
import AdminPanel from './AdminPanel'
import Expenses from "./Expenses";
import { useApi } from "../context/ApiContext";
import { ItemsContext } from "../App";
import ConfirmModel from "../Components/UI/ConfirmModel";

function AdminDashboard() {
  const { get } = useApi();
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ps";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 757);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [orders, setOrders] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState([]);
  const [weekOrders, setWeekOrders] = useState([]);
  const [monthOrders, setMonthOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const {user} = useContext(ItemsContext);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch dataa
  useEffect(() => {
    get('/api/v1/orders/count/daily')
      .then(response => setTodayOrders(response.data.data.count))
      .catch(err => console.error("Error fetching today's orders:", err));

    get('/api/v1/orders/count/weekly')
      .then(response => setWeekOrders(response.data.data.count))
      .catch(err => console.error("Error fetching this week's orders:", err));

    get('/api/v1/orders/count/monthly')
      .then(response => setMonthOrders(response.data.data.count))
      .catch(err => console.error("Error fetching this month's orders:", err));

    get('/api/v1/revenue/daily')
      .then(response => setTodayRevenue(response.data.data.revenue))
      .catch(err => console.error("Error fetching today's revenue:", err));
  }, []);

  // Handle menu click (close sidebar on mobile)
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Confirm modal */}
      <ConfirmModel
        isOpen={showConfirm}
        title={t("DeleteFood", { defaultValue: "Delete Food" })}
        message={t("ConfirmDeleteFoodMessage", { defaultValue: "Are you sure you want to delete this food item?" })}
        onConfirm={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
      />


      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-yellow-600 text-white rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <AiOutlineMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full bg-white shadow-xl transition-transform z-40
        ${sidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"} md:translate-x-0 w-64`}>
        
        <div className="p-6 border-b border-gray-200 flex flex-row justify-center items-center">
          <img src={Logo} alt="Logo" className="w-[150px] h-[150px]" />
        </div>

        <nav className="p-6 flex flex-col gap-3 text-yellow-600">
          <div
            onClick={() => handleMenuClick("Overview")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Overview" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineAppstore size={20} />
            <span>{t("Overview")}</span>
          </div>

          <div
            onClick={() => handleMenuClick("AdminPanel")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "AdminPanel" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineAppstore size={20} />
            <span>{t("AdminPanel")}</span>
          </div>

          <div
            onClick={() => handleMenuClick("Foods")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Foods" ? "bg-yellow-100" : ""
            }`}>
            <FontAwesomeIcon icon={faBurger} />
            <span>{t("Foods")}</span>
          </div>

          <div
            onClick={() => handleMenuClick("Tables")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Tables" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineTable size={20} />
            <span>{t("Tables")}</span>
          </div>

          <div
            onClick={() => handleMenuClick("Expenses")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Expenses" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineTable size={20} />
            <span>{t("Expenses")}</span>
          </div>

          <div
            onClick={() => handleMenuClick("OrderHistory")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "OrderHistory" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineHistory size={20} />
            <span>{t("OrderHistory")}</span>
          </div>
        </nav>
      </div>

      
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 blur-[0.5px] bg-opacity-20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isRTL ? "md:mr-64" : "md:ml-64"} transition-all duration-300`}>
        <div className="p-6">
          {activeMenu === "Overview" && (user.permissions.includes('overview_access') || user.permissions.includes('admin_access')) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <h1 className="text-[30px] justify-center text-center mb-[21px] sm:text-[45px] md:col-span-4 font-bold text-yellow-600">
                {t("AdminDashboard")}
              </h1>

              <div className="col-span-4 flex flex-row w-full justify-center space-x-[30px]">
                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">{t("LastMonthOrders")}</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">{monthOrders}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">{t("LastWeekOrders")}</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">{weekOrders}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">{t("TodayOrders")}</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">{todayOrders}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">{t("TodayRevenue")}</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">
                    ${todayRevenue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <OverviewChart />
              </div>
            </div>
          )}

          {activeMenu === "Tables" && (user.permissions.includes('admin_access') || user.permissions.includes('table_access')) && <Tables />}
          {activeMenu === "OrderHistory" && (user.permissions.includes('admin_access') || user.permissions.includes('order_history_access')) && <OrderHistory />}
          {activeMenu === "Foods" && (user.permissions.includes('admin_access') || user.permissions.includes('food_access')) &&  <FoodDataStorage />}
          {activeMenu === "AdminPanel" && (user.permissions.includes('panel_access') || user.permissions.includes('admin_access')) && <AdminPanel />}
          {activeMenu === "Expenses" && (user.permissions.includes('admin_access') || user.permissions.includes('expense_access')) && <Expenses />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;