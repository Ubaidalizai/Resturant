import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faUtensils,
  faTable,
  faUser,
  faUserShield,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";
import { ItemsContext } from "../App";

function Management() {
  const { t } = useTranslation("common");
  const { get, post, put, del } = useApi();
  const { user } = useContext(ItemsContext);

  const [activeTab, setActiveTab] = useState("Menus");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const { confirmState, openConfirm, closeConfirm, handleConfirm } =
    useConfirmModel();

  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [garsons, setGarsons] = useState([]);
  const [role, setRole] = useState([]);
  const [staff, setStaff] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [newItem, setNewItem] = useState({
    name: "",
    catagory: "",
    username: "",
    email: "",
    password: "",
    capacity: "",
    phone: "",
    role: "",
    salary: "",
    address: "",
    nationalId: "",
    employmentType: "",
    status: "",
    selectedPermissions: [],
  });

  useEffect(() => {
    fetchMenus();
    fetchTables();
    fetchGarsons();
    fetchRoles();
    fetchStaff();
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await get("/api/v1/permissions");
      setPermissions(res.data.data || []);
    } catch (err) {}
  };

  const fetchRoles = async () => {
    try {
      const res = await get("/api/v1/role/get");
      setRole(res.data.data.roles || []);
    } catch (err) {}
  };

  const fetchMenus = async () => {
    try {
      const res = await get("/api/v1/menues/all");
      setMenus(res.data.data || []);
    } catch {
      toast.error(t("FailedToLoadMenus", { defaultValue: "Failed to load menus" }));
    }
  };

  const fetchTables = async () => {
    try {
      const res = await get("/api/v1/tables/all");
      setTables(res.data.data || []);
    } catch {
      toast.error(t("FailedToLoadTables", { defaultValue: "Failed to load tables" }));
    }
  };

  const fetchGarsons = async () => {
    try {
      const res = await get("/api/v1/users/all/");
      setGarsons(res.data.data || []);
    } catch {
      toast.error(t("FailedToLoadGarsons", { defaultValue: "Failed to load garsons" }));
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await get("/api/v1/staff/all");
      setStaff(res.data.data || []);
    } catch {
      toast.error(t("FailedToLoadStaff", { defaultValue: "Failed to load staff" }));
    }
  };

  const openModal = (item = null) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  const getAddLabel = () => {
    if (activeTab === "Menus") return t("AddMenu", { defaultValue: "Add Menu" });
    if (activeTab === "Tables") return t("AddTable", { defaultValue: "Add Table" });
    if (activeTab === "Garsons") return t("AddGarson", { defaultValue: "Add Garson" });
    if (activeTab === "Role") return t("AddRole", { defaultValue: "Add Role" });
    if (activeTab === "Staff") return t("AddStaff", { defaultValue: "Add Staff" });
    return t("Add", { defaultValue: "Add" });
  };

  const handleAdd = () => {
    setEditItem(null);
    setNewItem({
      name: "",
      catagory: "",
      username: "",
      email: "",
      password: "",
      capacity: "",
      phone: "",
      role: "",
      salary: "",
      address: "",
      nationalId: "",
      employmentType: "",
      status: "",
      selectedPermissions: [],
    });
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === "Menus") {
        await del(`/api/v1/menues/delete/${id}`);
        fetchMenus();
      } else if (activeTab === "Tables") {
        await del(`/api/v1/tables/delete/${id}`);
        fetchTables();
      } else if (activeTab === "Garsons") {
        await del(`/api/v1/users/delete/${id}`);
        fetchGarsons();
      } else if (activeTab === "Role") {
        await del(`/api/v1/role/delete/${id}`);
        fetchRoles();
      } else if (activeTab === "Staff") {
        await del(`/api/v1/staff/delete/${id}`);
        fetchStaff();
      }

      toast.success(t("DeletedSuccessfully", { defaultValue: "Deleted successfully" }));
    } catch {
      toast.error(t("DeleteFailed", { defaultValue: "Delete failed" }));
    }
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);

    openConfirm({
      title: t("ConfirmDelete", { defaultValue: "Confirm Delete" }),
      message: t("ConfirmDeleteMessage", {
        defaultValue: "Are you sure you want to delete this item?",
      }),
      onConfirm: async () => {
        await handleDelete(id);
        setPendingDeleteId(null);
      },
    });
  };

  const tabIcons = {
    Menus: faUtensils,
    Tables: faTable,
    Garsons: faUser,
    Role: faUserShield,
    Staff: faUser,
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6">
        {t("RestaurantAdminPanel", { defaultValue: "Restaurant Admin Panel" })}
      </h1>

      <div className="flex gap-4 flex-wrap justify-center mb-2">
        {["Menus", "Tables", "Garsons", "Role", "Staff"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl flex gap-2 items-center
            ${
              activeTab === tab
                ? "bg-yellow-500 text-white"
                : "bg-white text-black"
            }`}
          >
            <FontAwesomeIcon icon={tabIcons[tab]} />
            {t(tab, { defaultValue: tab })}
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleAdd}
          className="px-5 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition mt-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {getAddLabel()}
        </button>
      </div>

      <div className="bg-white rounded-md overflow-hidden text-black border border-gray-50">
        <table className="w-full text-center border-collapse">
          <thead className="bg-yellow-100">
            <tr>
              {activeTab === "Menus" && (
                <>
                  <th className="p-4 border border-gray-200">{t("Menu", { defaultValue: "Menu" })}</th>
                  <th className="border border-gray-300">{t("Category", { defaultValue: "Category" })}</th>
                  <th className="border border-gray-300">{t("Actions", { defaultValue: "Actions" })}</th>
                </>
              )}

              {activeTab === "Tables" && (
                <>
                  <th className="p-4 border border-gray-300">{t("Table", { defaultValue: "Table" })}</th>
                  <th className="border border-gray-300">{t("Capacity", { defaultValue: "Capacity" })}</th>
                  <th className="border border-gray-300">{t("Actions", { defaultValue: "Actions" })}</th>
                </>
              )}

              {activeTab === "Garsons" && (
                <>
                  <th className="p-4 border border-gray-300">{t("Name", { defaultValue: "Name" })}</th>
                  <th className="border border-gray-300">{t("Email", { defaultValue: "Email" })}</th>
                  <th className="border border-gray-300">{t("Role", { defaultValue: "Role" })}</th>
                  <th className="border border-gray-300">{t("Phone", { defaultValue: "Phone" })}</th>
                  <th className="border border-gray-300">{t("Actions", { defaultValue: "Actions" })}</th>
                </>
              )}

              {activeTab === "Role" && (
                <>
                  <th className="p-4 border border-gray-300">{t("Role", { defaultValue: "Role" })}</th>
                  <th className="border border-gray-300">{t("Permissions", { defaultValue: "Permissions" })}</th>
                  <th className="border border-gray-300">{t("Actions", { defaultValue: "Actions" })}</th>
                </>
              )}

              {activeTab === "Staff" && (
                <>
                  <th className="p-4 border border-gray-300">{t("Name", { defaultValue: "Name" })}</th>
                  <th className="border border-gray-300">{t("Phone", { defaultValue: "Phone" })}</th>
                  <th className="border border-gray-300">{t("Address", { defaultValue: "Address" })}</th>
                  <th className="border border-gray-300">{t("Salary", { defaultValue: "Salary" })}</th>
                  <th className="border border-gray-300">{t("Status", { defaultValue: "Status" })}</th>
                  <th className="border border-gray-300">{t("Actions", { defaultValue: "Actions" })}</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {activeTab === "Menus" &&
              menus.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-200">{m.name}</td>
                  <td className="border border-gray-300">{m.catagory}</td>

                  <td className="border border-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openModal(m)}
                        className="text-blue-500"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        onClick={() => requestDelete(m._id)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {activeTab === "Tables" &&
              tables.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-300">
                    {t.tableNumber}
                  </td>
                  <td className="border border-gray-300">{t.capacity}</td>

                  <td className="border border-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openModal(t)}
                        className="text-blue-500"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        onClick={() => requestDelete(t._id)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {activeTab === "Garsons" &&
              garsons.map((g) => (
                <tr key={g._id} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-300">{g.name}</td>
                  <td className="border border-gray-300">{g.email}</td>
                  <td className="border border-gray-300">{g.role?.role}</td>
                  <td className="border border-gray-300">{g.phone}</td>

                  <td className="border border-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openModal(g)}
                        className="text-blue-500"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        onClick={() => requestDelete(g._id)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {activeTab === "Role" &&
              role.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-300">{r.role}</td>

                  <td className="border border-gray-300">
                    {(r.permissions || [])
                      .map((p) => p.name || p)
                      .join(", ")}
                  </td>

                  <td className="border border-gray-200">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openModal(r)}
                        className="text-blue-500"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        onClick={() => requestDelete(r._id)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {activeTab === "Staff" &&
              staff.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-200">
                    {s.fullName}
                  </td>
                  <td className="border border-gray-200">{s.phone}</td>
                  <td className="border border-gray-200">
                    {s.address || "-"}
                  </td>
                  <td className="border border-gray-200">{s.salary}</td>
                  <td className="border border-gray-200">{s.status}</td>

                  <td className="border border-gray-200">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openModal(s)}
                        className="text-blue-500"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        onClick={() => requestDelete(s._id)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ConfirmModel
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={() => {
          closeConfirm();
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}

export default Management;