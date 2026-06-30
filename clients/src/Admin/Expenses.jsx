import React, { useState, useEffect, useContext } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "../../node_modules/react-i18next";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";
import Button from "../Components/UI/Button";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";
import { ItemsContext } from "../App";

function Expenses() {
  const { get, post, del } = useApi();
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ps";
  const { user } = useContext(ItemsContext);

  // CATEGORY STATES
  const [categories, setCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCatId, setEditCatId] = useState(null);

  // EXPENSE STATES
  const [expenses, setExpenses] = useState([]);
  const [showExpModal, setShowExpModal] = useState(false);
  const [title, setTitle] = useState("");
  const [pendingCategoryDelete, setPendingCategoryDelete] = useState(null);
  const [pendingExpenseDelete, setPendingExpenseDelete] = useState(null);
  const { confirmState, openConfirm, closeConfirm, handleConfirm } = useConfirmModel();
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await get("/api/v1/expenseCatagories/all");
      setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.log(err);
      setCategories([]);
    }
  };

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const res = await get("/api/v1/expenses/all");
      setExpenses(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.log(err);
      setExpenses([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  // ADD / UPDATE CATEGORY
  const saveCategory = async () => {
    if (!name) return toast.error(t("CategoryNameRequired", { defaultValue: "Category name required" }));
    try {
      await post("/api/v1/expenseCatagories/add", { name, description: description || "" });
      toast.success(editCatId ? t("CategoryUpdated", { defaultValue: "Category Updated" }) : t("CategoryAdded", { defaultValue: "Category Added" }));
      setName(""); setDescription(""); setEditCatId(null); setShowCatModal(false);
      fetchCategories();
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("OperationFailed", { defaultValue: "Operation failed" }));
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      await del(`/api/v1/expenseCatagories/delete/${id}`);
      toast.success(t("CategoryDeleted", { defaultValue: "Category Deleted" }));
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const requestDeleteCategory = (id) => {
    setPendingCategoryDelete(id);
    openConfirm({
      title: t("DeleteCategory", { defaultValue: "Delete Category" }),
      message: t("ConfirmDeleteCategoryMessage", { defaultValue: "Are you sure you want to delete this category?" }),
      onConfirm: async () => {
        await deleteCategory(id);
        setPendingCategoryDelete(null);
      },
    });
  };

  // EDIT CATEGORY
  const editCategory = (cat) => {
    setEditCatId(cat._id);
    setName(cat.name);
    setDescription(cat.description);
    setShowCatModal(true);
  };

  // ADD EXPENSE
  const addExpense = async () => {
    if (!title || !categoryId || !amount) return toast.error(t("FillRequiredFields", { defaultValue: "Fill required fields" }));
    try {
      console.log("Catagory id", categoryId)
      await post("/api/v1/expenses/add", { title, catagory: categoryId, amount, date, note });
      toast.success(t("ExpenseAddedSuccessfully", { defaultValue: "Expense added successfully" }));
      setTitle(""); setCategoryId(""); setAmount(""); setDate(""); setNote(""); setShowExpModal(false);
      fetchExpenses();
    } catch (err) {
      console.log(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || err.message || t("OperationFailed", { defaultValue: "Operation failed" }));
    }
  };

  // DELETE EXPENSE
  const deleteExpense = async (id) => {
    try {
      await del(`/api/v1/expenses/delete/${id}`);
      toast.success(t("ExpenseDeleted", { defaultValue: "Expense Deleted" }));
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const requestDeleteExpense = (id) => {
    setPendingExpenseDelete(id);
    openConfirm({
      title: t("DeleteExpense", { defaultValue: "Delete Expense" }),
      message: t("ConfirmDeleteExpenseMessage", { defaultValue: "Are you sure you want to delete this expense?" }),
      onConfirm: async () => {
        await deleteExpense(id);
        setPendingExpenseDelete(null);
      },
    });
  };


  return (
    <div className="space-y-4">
      {/* CATEGORY TABLE */}
      <div className="erp-panel p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4 items-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{t("Categories", { defaultValue: "Categories" })}</h2>
          <div className={isRTL ? "flex justify-start" : "flex justify-end"}>
            <button
              onClick={() => { setShowCatModal(true); setEditCatId(null); setName(""); setDescription(""); }}
              className="btn-primary flex items-center gap-2"
            >
              <AiOutlinePlus /> {t("AddCategory", { defaultValue: "Add Category" })}
            </button>
          </div>
        </div>
        <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th>{t("Name", { defaultValue: "Name" })}</th>
              <th>{t("Description", { defaultValue: "Description" })}</th>
              <th>{t("Actions", { defaultValue: "Actions" })}</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="3" className="text-center p-6 text-slate-400">{t("NoCategories", { defaultValue: "No categories" })}</td></tr>
            ) : (
              categories.map(c => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <div className="flex gap-3">
                      <AiOutlineEdit className="text-blue-600 cursor-pointer" size={18} onClick={() => editCategory(c)} />
                      <AiOutlineDelete className="text-red-600 cursor-pointer" size={18} onClick={() => requestDeleteCategory(c._id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="modal-backdrop" onClick={() => setShowCatModal(false)}>
          <div className="modal-card p-6 w-[350px] relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl mb-4">{editCatId ? t("EditCategory", { defaultValue: "Edit Category" }) : t("AddCategory", { defaultValue: "Add Category" })}</h2>
            <InputField placeholder={t("CategoryName", { defaultValue: "Category Name" })} value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-3" />
            <InputField placeholder={t("Description", { defaultValue: "Description" })} value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full mb-4" />
            <div className="modal-footer">
              <Button onClick={() => setShowCatModal(false)} variant="cancel">{t("Cancel", { defaultValue: "Cancel" })}</Button>
              <Button onClick={saveCategory} variant="primary">{t("Save", { defaultValue: "Save" })}</Button>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSE TABLE */}
      <div className="erp-panel p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4 items-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{t("AllExpenses", { defaultValue: "All Expenses" })}</h2>
          <div className={isRTL ? "flex justify-start" : "flex justify-end"}>
            <button onClick={() => setShowExpModal(true)} className="btn-primary flex gap-2 items-center">
              <AiOutlinePlus /> {t("AddExpense", { defaultValue: "Add Expense" })}
            </button>
          </div>
        </div>
        <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th>{t("Title", { defaultValue: "Title" })}</th>
              <th>{t("Category", { defaultValue: "Category" })}</th>
              <th>{t("Amount", { defaultValue: "Amount" })}</th>
              <th>{t("Date", { defaultValue: "Date" })}</th>
              <th>{t("Note", { defaultValue: "Note" })}</th>
              <th>{t("Action", { defaultValue: "Action" })}</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-6 text-slate-400">{t("NoExpenses", { defaultValue: "No expenses" })}</td></tr>
            ) : (
              expenses.map(e => (
                <tr key={e._id}>
                  <td>{e.title}</td>
                  <td>{e.category?.name || e.catagoryId?.name || "-"}</td>
                  <td className="text-red-600">${e.amount}</td>
                  <td>{(e.expensesDate || e.date)?.toString().slice(0, 10)}</td>
                  <td>{e.note}</td>
                  <td>
                    <AiOutlineDelete className="text-red-600 cursor-pointer" size={18} onClick={() => requestDeleteExpense(e._id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* EXPENSE MODAL */}
      {showExpModal && (
        <div className="modal-backdrop" onClick={() => setShowExpModal(false)}>
          <div className="modal-card p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl mb-4">{t("AddExpense", { defaultValue: "Add Expense" })}</h2>
            <InputField placeholder={t("Title", { defaultValue: "Title" })} value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full mb-3" />
            <select className="border p-2 w-full mb-3" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">{t("SelectCategory", { defaultValue: "Select Category" })}</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <InputField type="number" placeholder={t("Amount", { defaultValue: "Amount" })} value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 w-full mb-3" />
            <InputField type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 w-full mb-3" />
            <InputField placeholder={t("Note", { defaultValue: "Note" })} value={note} onChange={e => setNote(e.target.value)} className="border p-2 w-full mb-4" />
            <div className="modal-footer">
              <Button onClick={() => setShowExpModal(false)} variant="cancel">{t("Cancel", { defaultValue: "Cancel" })}</Button>
              <Button onClick={addExpense} variant="primary">{t("Save", { defaultValue: "Save" })}</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModel
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={() => { closeConfirm(); setPendingCategoryDelete(null); setPendingExpenseDelete(null); }}
      />

    </div>
  );
}

export default Expenses;