import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const items = [];

const foodDataStorage = () => {
  const data = localStorage.getItem("FoodData");
  try {
    return data ? JSON.parse(data) : items;
  } catch (err) {
    console.log(err.message);
    return items;
  }
};

function FoodDataStorage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [enterFoodData, setEnterFoodData] = useState(() => foodDataStorage());
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("FoodData", JSON.stringify(enterFoodData));
  }, [enterFoodData]);

  const submithandler = (e) => {
    e.preventDefault();

    const foodData = {
      id: Date.now(),
      name,
      price,
      category,
      image,
    };

    setEnterFoodData((pre) => [...pre, { ...foodData }]);
    toast.success(`${foodData.name} Was added Successfully`);

    setName("");
    setPrice("");
    setCategory("");
    setImage("");
  };

  const deletFood = (foodId) => {
    const updateFoods = enterFoodData.filter((food) => food.id !== foodId);
    setEnterFoodData(updateFoods);
    localStorage.setItem("FoodData", JSON.stringify(updateFoods));
  };

  const [modal, setModal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const openEditModal = (food) => {
    setSelectedFood(food);
    setName(food.name);
    setPrice(food.price);
    setCategory(food.category);
    setImage(food.image);
    setModal("edit");

    setName("");
    setPrice("");
    setCategory("");
    setImage("");
  };

  const openRemoveModal = (food) => {
    setSelectedFood(food);
    setModal("remove");
  };

  const updateFood = () => {
    const updatedFoods = enterFoodData.map((food) =>
      food.id === selectedFood.id
        ? { ...food, name, price, category, image }
        : food
    );

    setEnterFoodData(updatedFoods);
    localStorage.setItem("FoodData", JSON.stringify(updatedFoods));

    setModal(null);
    setSelectedFood(null);

    setName("");
    setPrice("");
    setCategory("");
    setImage("");

    if (name === "" || price === "" || category === "" || image === "") {
      toast.warn("Please fill the all blanks");
    } else {
      toast.success("Your Food Was Successfully Updated");
    }
  };

  const filteredFoods = enterFoodData.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-extrabold text-yellow-600 text-center">
        Foods Storage
      </h1>

      <button
        onClick={() => setModal("add")}
        className="bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition"
      >
        Add Food
      </button>

      <input
        type="text"
        placeholder="Search food by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-4xl border-2 border-yellow-600 rounded-xl px-4 py-3 text-black"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center"
          >
            <img
              src={food.image}
              alt={food.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{food.name}</h2>
            <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 mt-2">
              {food.category}
            </span>
            <p className="text-yellow-600 font-bold text-lg mt-2">${food.price}</p>

            <div className="flex space-x-4 mt-4">
              <AiOutlineEdit
                className="text-blue-600 cursor-pointer text-xl"
                onClick={() => openEditModal(food)}
              />
              <AiOutlineDelete
                className="text-red-500 cursor-pointer text-xl"
                onClick={() => openRemoveModal(food)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm"></div>

          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl z-10">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 font-bold text-black text-xl cursor-pointer"
            >
              X
            </button>

            {/* ADD MODAL */}
            {modal === "add" && (
              <form onSubmit={submithandler} className="space-y-4 text-black">
                <h2 className="text-2xl font-bold text-yellow-600 text-center">
                  Add Food
                </h2>

                <input
                  type="text"
                  placeholder="Food Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full"
                />

                <input
                  type="number"
                  placeholder="$Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full"
                >
                  <option value="">Select Category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch & Dinner">Lunch & Dinner</option>
                  <option value="Drinks">Drinks</option>
                </select>

                {/* IMAGE UPLOAD (ADD) */}
                <label className="w-full border-2 border-dashed border-yellow-600 rounded-xl px-4 py-3 text-center cursor-pointer flex items-center justify-center hover:bg-yellow-50 transition">
                  <span className="font-semibold text-yellow-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setImage(URL.createObjectURL(e.target.files[0]))
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="bg-yellow-600 text-white font-bold py-3 rounded-xl w-full cursor-pointer hover:scale-105 transition"
                >
                  Add Food
                </button>
              </form>
            )}

            {/* EDIT MODAL */}
            {modal === "edit" && (
              <div className="space-y-4 text-black">
                <h2 className="text-2xl font-bold text-blue-600 text-center">
                  Edit Food
                </h2>

                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-blue-600 rounded-xl px-4 py-3 w-full"
                />

                <input
                  type="number"
                  placeholder="$Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-2 border-blue-600 rounded-xl px-4 py-3 w-full"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-2 border-blue-600 rounded-xl px-4 py-3 w-full"
                >
                  <option value="">Select Category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch & Dinner">Lunch & Dinner</option>
                  <option value="Drinks">Drinks</option>
                </select>

                {/* IMAGE UPLOAD (EDIT) */}
                <label className="w-full border-2 border-dashed border-blue-600 rounded-xl px-4 py-3 text-center cursor-pointer flex items-center justify-center hover:bg-blue-50 transition">
                  <span className="font-semibold text-blue-600">Upload New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setImage(URL.createObjectURL(e.target.files[0]))
                    }
                  />
                </label>

                <button
                  onClick={updateFood}
                  className="bg-blue-600 text-white font-bold py-3 rounded-xl w-full cursor-pointer hover:scale-105 transition"
                >
                  Update Food
                </button>
              </div>
            )}

            {/* REMOVE MODAL */}
            {modal === "remove" && selectedFood && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
                  <h2 className="text-2xl font-bold text-red-500 text-center">Delete Order</h2>
                  <p className="text-center text-black">
                    Are you sure you want to delete order on{" "}
                    <span className="font-bold">{selectedFood.name}</span>?
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setModal(null)}
                      className="w-full bg-gray-300 py-3 rounded-xl font-bold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deletFood(selectedFood.id);
                        toast.success(` ${selectedFood.name} deleted successfully`);
                        setModal(null);
                      }}
                      className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodDataStorage;
