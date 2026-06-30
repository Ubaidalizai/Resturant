import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "../../node_modules/react-i18next";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import ConfirmModel from "../Components/UI/ConfirmModel";
import useConfirmModel from "../Components/UI/useConfirmModel";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";

function FoodDataStorage() {
  const { t } = useTranslation("common");
  const { get, post, put, del, baseURL } = useApi();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); 
  const [image, setImage] = useState(null);
  const [enterFoodData, setEnterFoodData] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const { confirmState, openConfirm, closeConfirm, handleConfirm } = useConfirmModel();

  // Fetch foods (extracted so it can be called on demand)
  const fetchFoods = async () => {
    try {
      const res = await get('/api/v1/foods/all');
      setEnterFoodData(res.data.data || []);
    } catch (err) {
      console.log(err.message);
      toast.error(t("FailedToFetchFoods", { defaultValue: "Failed to fetch foods" }));
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get('/api/v1/menues/all');
        setCategories(res.data.data || []);
      } catch (err) {
        console.log(err.message);
        toast.error(t("FailedToFetchCategories", { defaultValue: "Failed to fetch categories" }));
      }
    };
    fetchCategories();
  }, []);

  // Add Food
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !image) {
      toast.warn(t("PleaseFillAllFieldsAndSelectImage", { defaultValue: "Please fill all fields and select an image" }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);

      formData.append("catagory", category); // send id, not name

      formData.append("image", image);

      const res = await post(`/api/v1/foods/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // backend returns the new food in res.data.data
      const created = res.data.data;
      // refresh list instead of manual push so filters/search remain accurate
      await fetchFoods();
      setSearch("");
      toast.success(getTranslatedServerMessage(res.data?.message, t) || t("FoodAddedSuccessfully", { defaultValue: `${created.name} was added successfully` }));

      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setModal(null);
    } catch (err) {
      console.log(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("FailedToAddFood", { defaultValue: "Failed to add food" }));
    }
  };

  // Update Food
  const updateFood = async () => {
    if (!name || !price || !category) {
      toast.warn(t("PleaseFillAllFields", { defaultValue: "Please fill all fields" }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("catagory", category); // send id
      if (image instanceof File) {
        formData.append("image", image);
      }

      const res = await put(
        `/api/v1/foods/update/${selectedFood._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedFoods = enterFoodData.map((food) =>
        food._id === selectedFood._id ? res.data.data : food
      );
      setEnterFoodData(updatedFoods);
      // also refresh from backend to pick up any server side changes (e.g. new image path)
      fetchFoods();
      toast.success(getTranslatedServerMessage(res.data?.message, t) || t("FoodUpdatedSuccessfully", { defaultValue: "Food updated successfully" }));

      setModal(null);
      setSelectedFood(null);
    } catch (err) {
      console.log(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("FailedToUpdateFood", { defaultValue: "Failed to update food" }));
    }
  };

  // Delete Food
  const deleteFood = async () => {
    // selectedFood must be set by caller
    if (!selectedFood) return;
    try {
      const res = await del(`/api/v1/foods/delete/${selectedFood._id}`);
      toast.success(getTranslatedServerMessage(res.data?.message, t) || t("FoodDeletedSuccessfully", { defaultValue: "Food deleted successfully" }));
      setEnterFoodData((prev) => prev.filter((f) => f._id !== selectedFood._id));
      fetchFoods();
    } catch (err) {
      console.log(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("FailedToDeleteFood", { defaultValue: "Failed to delete food" }));
    } finally {
      setModal(null);
      setSelectedFood(null);
    }
  };

  const filteredFoods = enterFoodData.filter(
    (food) => food.name && food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="erp-panel p-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <button type="button" onClick={() => setModal("add")} className="btn-primary">
          {t("AddFood", { defaultValue: "Add Food" })}
        </button>
        <InputField
          type="text"
          placeholder={t("SearchFoodByName", { defaultValue: "Search food by name..." })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFoods.map((food) => (
          <div key={food._id} className="erp-panel p-4 flex flex-col items-center">
            <img
              src={food.image ? `${baseURL}${food.image}` : "https://via.placeholder.com/96?text=No+Image"}
              alt={food.name || t("Food", { defaultValue: "Food" })}
              className="w-20 h-20 mb-3 object-cover border border-slate-200"
            />
            <h2 className="font-semibold text-slate-800">{food.name}</h2>
            <p className="text-blue-700 font-semibold mt-1">${food.price}</p>
            <div className="flex gap-3 mt-3">
              <AiOutlineEdit className="text-blue-600 cursor-pointer" size={18} onClick={() => {
                setSelectedFood(food); setName(food.name); setPrice(food.price);
                setCategory(food.catagory._id || food.catagory); setImage(null); setModal("edit");
              }} />
              <AiOutlineDelete className="text-red-600 cursor-pointer" size={18} onClick={() => {
                setSelectedFood(food);
                openConfirm({ title: t("DeleteFood"), message: t("ConfirmDeleteFoodMessage", { name: food.name }), onConfirm: deleteFood });
              }} />
            </div>
          </div>
        ))}
      </div>

      {modal && modal !== "delete" && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-card modal-card-md p-6 w-full relative" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={modal === "add" ? submitHandler : (e) => e.preventDefault()} className="space-y-1">
              <h2 className="erp-page-title mb-4">{modal === "add" ? t("AddFood") : t("EditFood")}</h2>
              <InputField type="text" label={t("FoodName")} value={name} onChange={(e) => setName(e.target.value)} />
              <InputField type="number" label={t("Price")} value={price} onChange={(e) => setPrice(e.target.value)} />
              <div className="form-field">
                <label className="erp-label">{t("Category")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="erp-select">
                  <option value="">{t("SelectCategory")}</option>
                  {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="erp-label">{t("UploadImage")}</label>
                <input type="file" accept="image/*" className="erp-input" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <div className="modal-footer">
                <Button type="button" onClick={() => setModal(null)} variant="cancel">{t("Cancel")}</Button>
                <Button onClick={modal === "edit" ? updateFood : null} type={modal === "add" ? "submit" : "button"} variant="primary">
                  {modal === "add" ? t("AddFood") : t("UpdateFood")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModel
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={() => { closeConfirm(); setSelectedFood(null); }}
      />
    </div>
  );
}

export default FoodDataStorage;