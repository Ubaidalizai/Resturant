import React, { useState, useEffect, useContext } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineClose,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";
import { ItemsContext } from "../App";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";

function Management({ initialTab = "Menus", singleModule = false }) {
  const { get, post, put, del } = useApi();
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ps";
  const { user } = useContext(ItemsContext);

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // lists
  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [garsons, setGarsons] = useState([]);
  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // modal / edit
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null); // original item when editing

  // unified newItem state (tracks all inputs across tabs)
  const initialNewItem = {
    // menus
    name: "",
    catagory: "",
    // tables
    tableNumber: "",
    capacity: "",
    // garsons
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "", // role id
    // role entity
    selectedPermissions: [], // array of permission ids
    // staff
    fullName: "",
    address: "",
    nationalId: "",
    salary: "",
    employmentType: "full-time",
    status: "active",
    role: "",
  };
  const [newItem, setNewItem] = useState(initialNewItem);
  const [errors, setErrors] = useState({});

  const validateAlphabetField = (field, value) => {
    // Only validate role names as Latin-only; name/address fields accept English and Pashto
    if (field !== "name" || !value) return "";
    return /^[A-Za-z\s]+$/.test(value)
      ? ""
      : t("OnlyAlphabetsAllowed");
  };

  const validatePhoneField = (field, value) => {
    if (field !== "phone" || !value) return "";
    return /^(\+937|07)\d{8}$/.test(value)
      ? ""
      : t("PhoneMustStartWith", { defaultValue: "Phone must start with +93 or 07" });
  };

  const handleInputChange = (field, value) => {
    const alphabetError = validateAlphabetField(field, value);
    const phoneError = validatePhoneField(field, value);
    const error = alphabetError || phoneError;

    setNewItem((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const { confirmState, openConfirm, closeConfirm, handleConfirm } =
    useConfirmModel();

  // fetchers
  const fetchPermissions = async () => {
    try {
      const res = await get("/api/v1/permissions");
      setPermissions(res.data.data || []);
    } catch (err) {
      console.error(err);
      setPermissions([]);
    }
  }; 

  const fetchRoles = async () => {
    try {
      const res = await get("/api/v1/role/get");
      setRoles(res.data.data.roles || []);
    } catch (err) {
      console.error(err);
      setRoles([]);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await get("/api/v1/menues/all");
      setMenus(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToLoadMenus", { defaultValue: "Failed to load menus" }));
    }
  };

  const fetchTables = async () => {
    try {
      const res = await get("/api/v1/tables/all");
      setTables(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToLoadTables", { defaultValue: "Failed to load tables" }));
    }
  };

  const fetchGarsons = async () => {
    try {
      const res = await get("/api/v1/users/all/");
      setGarsons(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToLoadGarsons", { defaultValue: "Failed to load garsons" }));
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await get("/api/v1/staff/all");
      setStaff(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToLoadStaff", { defaultValue: "Failed to load staff" }));
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchTables();
    fetchGarsons();
    fetchRoles();
    fetchStaff();
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers
  const openAddModal = () => {
    setEditItem(null);
    setNewItem(initialNewItem);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setErrors({});
    setEditItem(item);
    // populate newItem depending on activeTab and item shape
    const mapped = { ...initialNewItem };

    if (activeTab === "Menus") {
      mapped.name = item.name || "";
      mapped.catagory = item.catagory || item.category || "";
    } else if (activeTab === "Tables") {
      mapped.tableNumber = item.tableNumber || "";
      mapped.capacity = item.capacity || "";
    } else if (activeTab === "Garsons") {
      mapped.fullName = item.name || item.fullName || "";
      mapped.username = item.username || "";
      mapped.email = item.email || "";
      mapped.phone = item.phone || "";
      mapped.role = item.role?._id || item.role || "";
      // don't populate password
    } else if (activeTab === "Role") {
      mapped.name = item.role || item.name || "";
      mapped.selectedPermissions =
        (item.permissions || []).map((p) => (p._id ? p._id : p)) || [];
    } else if (activeTab === "Staff") {
      mapped.fullName = item.fullName || item.name || "";
      mapped.phone = item.phone || "";
      mapped.address = item.address || "";
      mapped.nationalId = item.nationalId || "";
      mapped.salary = item.salary || "";
      mapped.employmentType = item.employmentType || "";
      mapped.status = item.status || "";
      mapped.role = item.role || "";
    }

    setNewItem(mapped);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setNewItem(initialNewItem);
    setErrors({});
  };

  // toggles a permission in newItem.selectedPermissions
  const togglePermission = (permId) => {
    const set = new Set(newItem.selectedPermissions || []);
    if (set.has(permId)) set.delete(permId);
    else set.add(permId);
    setNewItem({ ...newItem, selectedPermissions: Array.from(set) });
  };

  const validateCurrentFields = () => {
    const newErrors = {};
    const checkField = (field, value) => {
      const alphabetError = validateAlphabetField(field, value);
      const phoneError = validatePhoneField(field, value);
      const error = alphabetError || phoneError;
      if (error) newErrors[field] = error;
    };

    if (activeTab === "Menus") {
      if (!newItem.name?.trim()) newErrors.name = t("MenuNameRequired", { defaultValue: "Menu name required" });
      if (!newItem.catagory?.trim()) newErrors.catagory = t("CategoryRequired", { defaultValue: "Category required" });
    } else if (activeTab === "Garsons") {
      checkField("fullName", newItem.fullName);
      checkField("phone", newItem.phone);
    } else if (activeTab === "Role") {
      checkField("name", newItem.name);
    } else if (activeTab === "Staff") {
      checkField("fullName", newItem.fullName);
      checkField("phone", newItem.phone);
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return newErrors;
  };

  // save (add or update) depending on activeTab
  const saveItem = async () => {
    try {
      const currentErrors = validateCurrentFields();
      if (Object.keys(currentErrors).length > 0) {
        return toast.error(
          t("PleaseFixValidationErrors", { defaultValue: "Please fix validation errors before saving." })
        );
      }

      if (activeTab === "Menus") {
        if (!newItem.name?.trim()) return toast.error(t("MenuNameRequired", { defaultValue: "Menu name required" }));
        if (!newItem.catagory?.trim()) return toast.error(t("CategoryRequired", { defaultValue: "Category required" }));
        const payload = { name: newItem.name.trim(), catagory: newItem.catagory.trim() };
        if (editItem) {
          await put(`/api/v1/menues/update/${editItem._id}`, payload);
        } else {
          await post(`/api/v1/menues/add`, payload);
        }
        await fetchMenus();
      } else if (activeTab === "Tables") {
        if (!newItem.tableNumber) return toast.error(t("TableNumberRequired", { defaultValue: "Table number required" }));
        const payload = { tableNumber: newItem.tableNumber, capacity: newItem.capacity };
        if (editItem) {
          await put(`/api/v1/tables/update/${editItem._id}`, payload);
        } else {
          await post(`/api/v1/tables/add`, payload);
        }
        await fetchTables();
      } else if (activeTab === "Garsons") {
        // Some APIs may not support adding garsons via frontend; we attempt add
        if (!newItem.fullName && !newItem.username) return toast.error(t("NameRequired", { defaultValue: "Name required" }));
        const payload = {
          name: newItem.fullName || newItem.name,
          username: newItem.username,
          email: newItem.email,
          password: newItem.password, // optional for update
          phone: newItem.phone,
          role: newItem.role,
        };
        if (editItem) {
          await put(`/api/v1/users/update/${editItem._id}`, payload);
        } else {
          console.log("User adding")
          await post(`/api/v1/user/register`, payload);
        }
        await fetchGarsons();
      } else if (activeTab === "Role") {
        if (!newItem.name) return toast.error(t("RoleNameRequired", { defaultValue: "Role name required" }));
        const payload = {
          role: newItem.name,
          permissions: newItem.selectedPermissions || [],
          id: editItem?._id,
        };
        if (editItem) {
          await put(`/api/v1/role/update`, payload);
        } else {
          await post(`/api/v1/role/add`, payload);
        }
        await fetchRoles();
      } else if (activeTab === "Staff") {
        if (!newItem.fullName) return toast.error(t("StaffNameRequired", { defaultValue: "Staff name required" }));
        const payload = {
          fullName: newItem.fullName,
          phone: newItem.phone,
          address: newItem.address,
          nationalId: newItem.nationalId,
          salary: newItem.salary,
          employmentType: newItem.employmentType,
          status: newItem.status,
          role: newItem.role || "",
        };
        if (editItem) {
          await put(`/api/v1/staff/update/${editItem._id}`, payload);
        } else {
          await post(`/api/v1/staff/add`, payload);
        }
        await fetchStaff();
      }

      toast.success(t("SavedSuccessfully", { defaultValue: "Saved successfully" }));
      closeModal();
    } catch (err) {
      console.error(err);
      const serverMessage = getTranslatedServerMessage(err.response?.data?.message, t) || err.response?.data?.message || err.message;
      toast.error(serverMessage || t("OperationFailed", { defaultValue: "Operation failed" }));
    }
  };

  // delete handler (with confirm)
  const handleDelete = async (id) => {
    try {
      if (activeTab === "Menus") {
        await del(`/api/v1/menues/delete/${id}`);
        await fetchMenus();
      } else if (activeTab === "Tables") {
        await del(`/api/v1/tables/delete/${id}`);
        await fetchTables();
      } else if (activeTab === "Garsons") {
        await del(`/api/v1/users/delete/${id}`);
        await fetchGarsons();
      } else if (activeTab === "Role") {
        await del(`/api/v1/role/delete/${id}`);
        await fetchRoles();
      } else if (activeTab === "Staff") {
        await del(`/api/v1/staff/delete/${id}`);
        await fetchStaff();
      }
      toast.success(t("DeletedSuccessfully", { defaultValue: "Deleted successfully" }));
    } catch (err) {
      console.error(err);
      toast.error(t("DeleteFailed", { defaultValue: "Delete failed" }));
    }
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
    openConfirm({
      title: t("ConfirmDelete", { defaultValue: "Confirm Delete" }),
      message: t("ConfirmDeleteMessage", { defaultValue: "Are you sure you want to delete this item?" }),
      onConfirm: async () => {
        await handleDelete(id);
        setPendingDeleteId(null);
      },
    });
  };

  // small utility to render Add button label
  const getAddLabel = () => {
    if (activeTab === "Menus") return t("AddMenu", { defaultValue: "Add Menu" });
    if (activeTab === "Tables") return t("AddTable", { defaultValue: "Add Table" });
    if (activeTab === "Garsons") return t("AddGarson", { defaultValue: "Add Garson" });
    if (activeTab === "Role") return t("AddRole", { defaultValue: "Add Role" });
    if (activeTab === "Staff") return t("AddStaff", { defaultValue: "Add Staff" });
    return t("Add", { defaultValue: "Add" });
  };

  const getActiveItemLabel = () => {
    const singularLabels = {
      Menus: "Menu",
      Tables: "Table",
      Garsons: "Garson",
      Role: "Role",
      Staff: "Staff",
    };

    const labelKey = singularLabels[activeTab] || activeTab;
    return t(labelKey, { defaultValue: labelKey });
  };

  return (
    <div className="space-y-4">
      {!singleModule && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["Menus", "Tables", "Garsons", "Role", "Staff"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "btn-primary" : "btn-secondary"}
              >
                {t(tab, { defaultValue: tab })}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="erp-panel p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4 items-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {t(activeTab, { defaultValue: activeTab })}
          </h2>
          <div className={isRTL ? "flex justify-start" : "flex justify-end"}>
            <button type="button" onClick={openAddModal} className="btn-primary flex items-center gap-2">
              <AiOutlinePlus /> {getAddLabel()}
            </button>
          </div>
        </div>

        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                {activeTab === "Menus" && (
                  <>
                    <th>{t("Menu", { defaultValue: "Menu" })}</th>
                    <th>{t("Category", { defaultValue: "Category" })}</th>
                    <th>{t("Actions", { defaultValue: "Actions" })}</th>
                  </>
                )}

                {activeTab === "Tables" && (
                  <>
                    <th>{t("Table", { defaultValue: "Table" })}</th>
                    <th>{t("Capacity", { defaultValue: "Capacity" })}</th>
                    <th>{t("Actions", { defaultValue: "Actions" })}</th>
                  </>
                )}

                {activeTab === "Garsons" && (
                  <>
                    <th>{t("Name", { defaultValue: "Name" })}</th>
                    <th>{t("Email", { defaultValue: "Email" })}</th>
                    <th>{t("Role", { defaultValue: "Role" })}</th>
                    <th>{t("Phone", { defaultValue: "Phone" })}</th>
                    <th>{t("Actions", { defaultValue: "Actions" })}</th>
                  </>
                )}

                {activeTab === "Role" && (
                  <>
                    <th>{t("Role", { defaultValue: "Role" })}</th>
                    <th>{t("Permissions", { defaultValue: "Permissions" })}</th>
                    <th>{t("Actions", { defaultValue: "Actions" })}</th>
                  </>
                )}

                {activeTab === "Staff" && (
                  <>
                    <th>{t("Name", { defaultValue: "Name" })}</th>
                    <th>{t("Role", { defaultValue: "Role" })}</th>
                    <th>{t("Phone", { defaultValue: "Phone" })}</th>
                    <th>{t("Address", { defaultValue: "Address" })}</th>
                    <th>{t("Salary", { defaultValue: "Salary" })}</th>
                    <th>{t("Status", { defaultValue: "Status" })}</th>
                    <th>{t("Actions", { defaultValue: "Actions" })}</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {/* MENUS */}
              {activeTab === "Menus" &&
                (menus.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-400">
                      {t("NoMenus", { defaultValue: "No menus" })}
                    </td>
                  </tr>
                ) : (
                  menus.map((m) => (
                    <tr key={m._id}>
                      <td>{m.name}</td>
                      <td>{m.catagory}</td>
                      <td>
                        <div className="flex gap-3">
                          <AiOutlineEdit className="text-blue-600 cursor-pointer" size={18} onClick={() => { setActiveTab("Menus"); openEditModal(m); }} />
                          <AiOutlineDelete className="text-red-600 cursor-pointer" size={18} onClick={() => requestDelete(m._id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ))}

              {/* TABLES */}
              {activeTab === "Tables" &&
                (tables.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-400">
                      {t("NoTables", { defaultValue: "No tables" })}
                    </td>
                  </tr>
                ) : (
                  tables.map((tItem) => (
                    <tr key={tItem._id}>
                      <td>{tItem.tableNumber}</td>
                      <td>{tItem.capacity}</td>
                      <td>
                        <div className="flex justify-center gap-4">
                          <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} onClick={() => { setActiveTab("Tables"); openEditModal(tItem); }} />
                          <AiOutlineDelete className="text-red-500 cursor-pointer" size={20} onClick={() => requestDelete(tItem._id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ))}

              {/* GARSONS */}
              {activeTab === "Garsons" &&
                (garsons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-400">
                      {t("NoGarsons", { defaultValue: "No garsons" })}
                    </td>
                  </tr>
                ) : (
                  garsons.map((g) => (
                    <tr key={g._id}>
                      <td>{g.name}</td>
                      <td>{g.email}</td>
                      <td>{g.role?.role}</td>
                      <td>{g.phone}</td>
                      <td>
                        <div className="flex justify-center gap-4">
                          <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} onClick={() => { setActiveTab("Garsons"); openEditModal(g); }} />
                          <AiOutlineDelete className="text-red-500 cursor-pointer" size={20} onClick={() => requestDelete(g._id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ))}

              {/* ROLES */}
              {activeTab === "Role" &&
                (roles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-400">
                      {t("NoRoles", { defaultValue: "No roles" })}
                    </td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r._id}>
                      <td>{r.role}</td>
                      <td>
                        {(r.permissions || []).map((p) => (p.name ? p.name : p)).join(", ")}
                      </td>
                      <td>
                        <div className="flex justify-center gap-4">
                          <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} onClick={() => { setActiveTab("Role"); openEditModal(r); }} />
                          <AiOutlineDelete className="text-red-500 cursor-pointer" size={20} onClick={() => requestDelete(r._id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ))}

              {/* STAFF */}
              {activeTab === "Staff" &&
                (staff.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-400">
                      {t("NoStaff", { defaultValue: "No staff" })}
                    </td>
                  </tr>
                ) : (
                  staff.map((s) => (
                    <tr key={s._id}>
                      <td>{s.fullName}</td>
                      <td>{s.role || "—"}</td>
                      <td>{s.phone}</td>
                      <td>{s.address || "-"}</td>
                      <td>{s.salary}</td>
                      <td>{s.status}</td>
                      <td>
                        <div className="flex justify-center gap-4">
                          <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} onClick={() => { setActiveTab("Staff"); openEditModal(s); }} />
                          <AiOutlineDelete className="text-red-500 cursor-pointer" size={20} onClick={() => requestDelete(s._id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (single dynamic modal similar style to Expenses component) */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl mb-4">
              {editItem ? `${t("Edit", { defaultValue: "Edit" })} ${getActiveItemLabel()}` : getAddLabel()}
            </h2>

            {/* MENUS */}
            {activeTab === "Menus" && (
              <>
                <InputField
                  placeholder={t("MenuName", { defaultValue: "Menu Name" })}
                  value={newItem.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                />
                <InputField
                  placeholder={t("Category", { defaultValue: "Category" })}
                  value={newItem.catagory}
                  onChange={(e) => handleInputChange("catagory", e.target.value)}
                  error={errors.catagory}
                />
              </>
            )}

            {/* TABLES */}
            {activeTab === "Tables" && (
              <>
                <InputField
                  placeholder={t("TableNumber", { defaultValue: "Table Number" })}
                  value={newItem.tableNumber}
                  onChange={(e) => setNewItem({ ...newItem, tableNumber: e.target.value })}
                  className="border p-2 w-full mb-3"
                />
                <InputField
                  placeholder={t("Capacity", { defaultValue: "Capacity" })}
                  type="number"
                  value={newItem.capacity}
                  onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })}
                  className="border p-2 w-full mb-4"
                />
              </>
            )}

            {/* GARSONS */}
            {activeTab === "Garsons" && (
              <>
                <InputField
                  placeholder={t("Name", { defaultValue: "Name" })}
                  value={newItem.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="border p-2 w-full mb-3"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                <InputField
                  placeholder={t("Username", { defaultValue: "Username" })}
                  value={newItem.username}
                  onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                  className="border p-2 w-full mb-3"
                />
                <InputField
                  placeholder={t("Email", { defaultValue: "Email" })}
                  type="email"
                  value={newItem.email}
                  onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                  className="border p-2 w-full mb-3"
                />
                <InputField
                  placeholder={t("Password", { defaultValue: "Password" })}
                  type="password"
                  value={newItem.password}
                  onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                  className="border p-2 w-full mb-3"
                />
                <select
                  className="border p-2 w-full mb-3"
                  value={newItem.role}
                  onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                >
                  <option value="">{t("SelectRole", { defaultValue: "Select Role" })}</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.role}
                    </option>
                  ))}
                </select>
                <InputField
                  placeholder={t("Phone", { defaultValue: "Phone" })}
                  value={newItem.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border p-2 w-full mb-4"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </>
            )}

            {/* ROLE */}
            {activeTab === "Role" && (
              <>
                <InputField
                  placeholder={t("RoleName", { defaultValue: "Role Name" })}
                  value={newItem.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border p-2 w-full mb-3"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">{t("Permissions", { defaultValue: "Permissions" })}</div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                    {permissions.length === 0 ? (
                      <div className="text-gray-400">{t("NoPermissions", { defaultValue: "No permissions" })}</div>
                    ) : (
                      permissions.map((p) => (
                        <label key={p._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(newItem.selectedPermissions || []).includes(p._id)}
                            onChange={() => togglePermission(p._id)}
                          />
                          <span>{p.name || p}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* STAFF */}
            {activeTab === "Staff" && (
              <>
                <InputField
                  placeholder={t("Name", { defaultValue: "Name" })}
                  value={newItem.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="border p-2 w-full mb-3"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                <InputField
                  placeholder={t("Role", { defaultValue: "Role" })}
                  value={newItem.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="border p-2 w-full mb-3"
                />
                <InputField
                  placeholder={t("Phone", { defaultValue: "Phone" })}
                  value={newItem.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border p-2 w-full mb-3"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                <InputField
                  placeholder={t("Address", { defaultValue: "Address" })}
                  value={newItem.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="border p-2 w-full mb-3"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                <InputField
                  placeholder={t("NationalId", { defaultValue: "National ID" })}
                  value={newItem.nationalId}
                  onChange={(e) => setNewItem({ ...newItem, nationalId: e.target.value })}
                  className="border p-2 w-full mb-3"
                />
                <InputField
                  placeholder={t("Salary")}
                  value={newItem.salary}
                  onChange={(e) => setNewItem({ ...newItem, salary: e.target.value })}
                  className="border p-2 w-full mb-3"
                />
                <div className="form-field mb-3">
                  <label className="erp-label">{t("EmploymentType")}</label>
                  <select
                    className="erp-select w-full"
                    value={newItem.employmentType || "full-time"}
                    onChange={(e) => setNewItem({ ...newItem, employmentType: e.target.value })}
                  >
                    <option value="full-time">{t("FullTime")}</option>
                    <option value="part-time">{t("PartTime")}</option>
                    <option value="contract">{t("Contract")}</option>
                    <option value="temporary">{t("Temporary")}</option>
                  </select>
                </div>
                <div className="form-field mb-4">
                  <label className="erp-label">{t("Status")}</label>
                  <select
                    className="erp-select w-full"
                    value={newItem.status || "active"}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                  >
                    <option value="active">{t("Active")}</option>
                    <option value="inactive">{t("Inactive")}</option>
                    <option value="terminated">{t("Terminated")}</option>
                  </select>
                </div>
              </>
            )}

            <div className="modal-footer">
              <Button onClick={closeModal} variant="cancel">
                {t("Cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button onClick={saveItem} variant="primary">
                {t("Save", { defaultValue: "Save" })}
              </Button>
            </div>
          </div>
        </div>
      )}

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