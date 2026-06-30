import React, { useContext, useState } from "react";
import { FiMenu, FiLogOut, FiClipboard, FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import KitchenOrders from "./KitchenOrders";
import KitchenOrderHistory from "./KitchenOrderHistory";
import { ItemsContext } from "../App";
import { useApi } from "../context/ApiContext";
import LanguageSwitcher from "../Components/UI/LanguageSwitcher";

function KitchenPanel() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { get } = useApi();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("orders");
  const { user, setIsAuth, setUser: setUserContext } = useContext(ItemsContext);

  const handleLogout = async () => {
    try {
      await get("/api/v1/user/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsAuth?.(false);
      setUserContext?.(null);
      navigate("/");
    }
  };

  const canAccess = user?.permissions?.some((p) =>
    ["admin_access", "kitchen_access"].includes(p)
  );

  if (!canAccess) return null;

  const pageTitle = activeView === "history"
    ? t("OrdersHistory", { defaultValue: "Orders History" })
    : t("KitchenOrders", { defaultValue: "Kitchen Orders" });

  const pageSubtitle = activeView === "history"
    ? t("KitchenOrdersHistorySubtitle", { defaultValue: "All received orders" })
    : t("ManageActiveOrders", { defaultValue: "Manage active orders" });

  return (
    <div className="erp-layout">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`erp-sidebar fixed top-0 left-0 h-full z-40 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="erp-sidebar-logo">
          <div className="erp-sidebar-logo-text">{t("KitchenDashboard", { defaultValue: "Kitchen Dashboard" })}</div>
        </div>
        <nav className="erp-sidebar-nav">
          <div
            className={`erp-nav-item ${activeView === "orders" ? "active" : ""}`}
            onClick={() => { setActiveView("orders"); if (window.innerWidth < 768) setSidebarOpen(false); }}
            role="button"
            tabIndex={0}
          >
            <FiClipboard />
            <span>{t("Orders", { defaultValue: "Orders" })}</span>
          </div>
          <div
            className={`erp-nav-item ${activeView === "history" ? "active" : ""}`}
            onClick={() => { setActiveView("history"); if (window.innerWidth < 768) setSidebarOpen(false); }}
            role="button"
            tabIndex={0}
          >
            <FiClock />
            <span>{t("OrdersHistory", { defaultValue: "Orders History" })}</span>
          </div>
        </nav>
        <div className="erp-sidebar-footer">
          <LanguageSwitcher variant="sidebar" />
          <div className="erp-nav-item" onClick={handleLogout} role="button" tabIndex={0}>
            <FiLogOut />
            <span>{t("Logout", { defaultValue: "Logout" })}</span>
          </div>
        </div>
      </aside>

      <div className="erp-main md:ml-[260px]">
        <header className="erp-topbar">
          <div className="flex items-center gap-3">
            <button type="button" className="btn-secondary p-2 md:hidden" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={18} />
            </button>
            <div>
              <h1 className="erp-page-title">{pageTitle}</h1>
              <p className="erp-page-subtitle">{pageSubtitle}</p>
            </div>
          </div>
        </header>
        <div className="erp-content">
          {activeView === "history" ? <KitchenOrderHistory /> : <KitchenOrders />}
        </div>
      </div>
    </div>
  );
}

export default KitchenPanel;
