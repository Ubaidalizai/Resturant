import { useState, useEffect } from "react";
import { useApi } from "../../context/ApiContext";

function FoodCard({ food, cart, setCart, resetKey }) {
  const { baseURL } = useApi();
  const cartItem = cart[food._id];
  const [qty, setQty] = useState(cartItem?.qty || 1);

  useEffect(() => {
    if (!cartItem) setQty(1);
    else setQty(cartItem.qty);
  }, [cartItem, resetKey]);

  const increase = () => setQty((prev) => prev + 1);
  const decrease = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = () => {
    setCart((prev) => ({ ...prev, [food._id]: { ...food, qty } }));
  };

  const isAdded = !!cartItem;
  const imageSrc = food.image?.startsWith("http")
    ? food.image
    : `${baseURL}${food.image}`;

  return (
    <div className="erp-panel food-card p-3">
      <img
        src={imageSrc}
        alt={food.name}
        className="h-36 w-full object-cover border border-slate-200 rounded-sm"
      />
      <h2 className="font-semibold text-slate-800 mt-2 text-sm truncate">{food.name}</h2>
      <p className="text-blue-700 font-semibold text-sm">${food.price}</p>
      <div className="flex justify-between items-center mt-auto pt-3 gap-2">
        <div className="qty-control">
          <button type="button" onClick={decrease} className="qty-control-btn" aria-label="Decrease quantity">−</button>
          <span className="qty-control-value">{qty}</span>
          <button type="button" onClick={increase} className="qty-control-btn" aria-label="Increase quantity">+</button>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className={`${isAdded ? "btn-success" : "btn-primary"} text-xs px-3 py-2 shrink-0`}
        >
          {isAdded ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
