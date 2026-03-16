import React, { useState, useEffect, useContext } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";
import { ItemsContext } from "../App";

function Expenses() {
  const { get, post, del } = useApi();
  const { t } = useTranslation("common");
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
      toast.error(err.response?.data?.message || t("OperationFailed", { defaultValue: "Operation failed" }));
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      await del(`/api/v1/expenseCatagories/delete/${id}`);
      toast.success("Category Deleted");
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const requestDeleteCategory = (id) => {
    setPendingCategoryDelete(id);
    openConfirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
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
    if (!title || !categoryId || !amount) return toast.error("Fill required fields");
    try {
      await post("/api/v1/expenses/add", { title, category: categoryId, amount, date, note });
      toast.success("Expense added successfully");
      setTitle(""); setCategoryId(""); setAmount(""); setDate(""); setNote(""); setShowExpModal(false);
      fetchExpenses();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // DELETE EXPENSE
  const deleteExpense = async (id) => {
    try {
      await del(`/api/v1/expenses/delete/${id}`);
      toast.success("Expense Deleted");
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const requestDeleteExpense = (id) => {
    setPendingExpenseDelete(id);
    openConfirm({
      title: "Delete Expense",
      message: "Are you sure you want to delete this expense?",
      onConfirm: async () => {
        await deleteExpense(id);
        setPendingExpenseDelete(null);
      },
    });
  };


  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6">Expenses Management</h1>

      {/* ADD CATEGORY BUTTON */}
      <button
        onClick={() => { setShowCatModal(true); setEditCatId(null); setName(""); setDescription(""); }}
        className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-6"
      >
        <AiOutlinePlus /> Add Category
      </button>

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[350px] relative">
            <button className="absolute right-3 top-3" onClick={() => setShowCatModal(false)}>
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-xl mb-4">{editCatId ? "Edit Category" : "Add Category"}</h2>
            <InputField placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-3" />
            <InputField placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full mb-4" />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowCatModal(false)} className="bg-gray-300 text-black">Cancel</Button>
              <Button onClick={saveCategory}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY TABLE */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <table className="w-full border border-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Description</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="3" className="text-center p-6 text-gray-400">No categories</td></tr>
            ) : (
              categories.map(c => (
                <tr key={c._id}>
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.description}</td>
                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-4">
                      <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} onClick={() => editCategory(c)} />
                      <AiOutlineDelete className="text-red-500 cursor-pointer" size={20} onClick={() => requestDeleteCategory(c._id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EXPENSE TABLE */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 overflow-x-auto">
        <div className="grid md:grid-cols-2 gap-4 mb-4 items-center">
          <h2 className="text-xl font-semibold">All Expenses</h2>
          <div className="flex md:justify-end">
            <button onClick={() => setShowExpModal(true)} className="bg-yellow-600 text-white px-4 py-2 rounded flex gap-2 items-center">
              <AiOutlinePlus /> Add Expense
            </button>
          </div>
        </div>
        <table className="w-full border border-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Note</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-6 text-gray-400">No expenses</td></tr>
            ) : (
              expenses.map(e => (
                <tr key={e._id} className="text-center">
                  <td className="p-3 border">{e.title}</td>
                  <td className="p-3 border">{e.category?.name || "-"}</td>
                  <td className="p-3 border text-red-600">${e.amount}</td>
                  <td className="p-3 border">{e.date?.slice(0, 10)}</td>
                  <td className="p-3 border">{e.note}</td>
                  <td className="p-3 border">
                    <AiOutlineDelete className="text-red-500 cursor-pointer mx-auto" size={20} onClick={() => requestDeleteExpense(e._id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EXPENSE MODAL */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button className="absolute right-3 top-3" onClick={() => setShowExpModal(false)}><AiOutlineClose /></button>
            <h2 className="text-xl mb-4">Add Expense</h2>
            <InputField placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full mb-3" />
            <select className="border p-2 w-full mb-3" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <InputField type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 w-full mb-3" />
            <InputField type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 w-full mb-3" />
            <InputField placeholder="Note" value={note} onChange={e => setNote(e.target.value)} className="border p-2 w-full mb-4" />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowExpModal(false)} className="bg-gray-300 text-black">Cancel</Button>
              <Button onClick={addExpense}>Save</Button>
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