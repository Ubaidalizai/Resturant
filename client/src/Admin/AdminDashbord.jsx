import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineTable, AiOutlineAppstore, AiOutlineHistory } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBurger } from '@fortawesome/free-solid-svg-icons';
import Tables from "./Tables";
import OrderHistory from "./OrderHistory";
import FoodDataStorage from './FoodDataStorage';
import Logo from'../images/logo.jpg';
import OverviewChart from "./OverviewChart";
import AdminPanel from './AdminPanel'
import Expenses from "./Expenses";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [orders, setOrders] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState([]);
  const [weekOrders, setWeekOrders] = useState([]);
  const [monthOrders, setMonthOrders] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("Orders");

    if (data) {
      const parsedOrders = JSON.parse(data);
      setOrders(parsedOrders);

      const today = new Date();

      
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const lastMonth = new Date();
      lastMonth.setDate(today.getDate() - 30);

      const toDate = (d) => new Date(d);

      
      const todayList = parsedOrders.filter(order =>
        toDate(order.date).toDateString() === today.toDateString()
      );

      
      const weekList = parsedOrders.filter(order =>
        toDate(order.date) >= lastWeek
      );

      
      const monthList = parsedOrders.filter(order =>
        toDate(order.date) >= lastMonth
      );

      setTodayOrders(todayList);
      setWeekOrders(weekList);
      setMonthOrders(monthList);

    
      const total = todayList.reduce(
        (sum, order) => sum + Number(order.orderTotal || 0),
        0
      );

      setTodayRevenue(total);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-transform z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}>
        <div className="p-6 border-b border-gray-200 flex flex-row justify-center items-center">
          <img src={Logo} alt="Logo" className="w-[150px] h-[150px]" />
        </div>

        <nav className="p-6 flex flex-col gap-3 text-yellow-600">
          <div
            onClick={() => setActiveMenu("Overview")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Overview" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineAppstore size={20} />
            <span>Overview</span>
          </div>

            <div
            onClick={() => setActiveMenu("AdminPanel")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "AdminPanel" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineAppstore size={20} />
            <span>Admin Panel</span>
          </div>

          <div
            onClick={() => setActiveMenu("Foods")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Foods" ? "bg-yellow-100" : ""
            }`}>
            <FontAwesomeIcon icon={faBurger} />
            <span>Foods</span>
          </div>

          <div
            onClick={() => setActiveMenu("Tables")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Tables" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineTable size={20} />
            <span>Tables</span>
          </div>

          <div
            onClick={() => setActiveMenu("Expenses")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Expenses" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineTable size={20} />
            <span>Expenses</span>
          </div>

          <div
            onClick={() => setActiveMenu("OrderHistory")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "OrderHistory" ? "bg-yellow-100" : ""
            }`}>
            <AiOutlineHistory size={20} />
            <span>Order History</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <div className="p-6">
          {activeMenu === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <h1 className="text-[30px] justify-center text-center mb-[21px] sm:text-[45px] md:col-span-4 font-bold text-yellow-600">
                Admin Dashboard
              </h1>

              <div className="col-span-4 flex flex-row w-full justify-center space-x-[30px]">
                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">Last Monthe Orders</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">{monthOrders.length}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">Last Week Orders</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">{weekOrders.length}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">Today Orders</h3>
                  <p className="text-yellow-600 text-3xl font-bold mt-2">{todayOrders.length}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <h3 className="text-gray-500 font-semibold">Today Revenue</h3>
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

          {activeMenu === "Tables" && <Tables />}
          {activeMenu === "OrderHistory" && <OrderHistory />}
          {activeMenu === "Foods" && <FoodDataStorage />}
          {activeMenu === "AdminPanel" && <AdminPanel />}
          {activeMenu === "Expenses" && <Expenses />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
