import { useState } from "react";

function FoodCard({ food, cart, setCart }) {
  const [qty, setQty] = useState(1);

  const increase = () => setQty(prev => prev + 1);
  const decrease = () => setQty(prev => (prev > 1 ? prev - 1 : 1));

  const addToCart = () => {
    setCart(prev => ({
      ...prev,
      [food._id]: { ...food, qty },
    }));
  };

  const isAdded = cart[food._id] ? true : false;

  return (
    <div className="bg-white rounded-xl p-4 w-[16rem] shadow hover:shadow-md transition">
      <img
        src={food.image}
        alt={food.name}
        className="h-40 w-full object-cover rounded-lg border-[2.5px] border-yellow-600 border-dotted"
      />
      <h2 className="font-semibold text-black mt-2">{food.name}</h2>
      <p className="text-yellow-600 font-bold">${food.price}</p>

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 items-center">
          <button onClick={decrease} className="w-8 h-8 border rounded border-yellow-500 text-yellow-600">−</button>
          <span className="text-yellow-600 font-semibold">{qty}</span>
          <button onClick={increase} className="w-8 h-8 border rounded border-yellow-500 text-yellow-600">+</button>
        </div>

        <button
          onClick={addToCart}
          className={`px-4 py-2 rounded font-semibold text-sm text-white ${isAdded ? "bg-green-700" : "bg-green-500"}`}
        >
          {isAdded ? "Added ✓" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default FoodCard;