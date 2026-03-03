function OrderSummary({ cart }) {
  const items = Object.values(cart);
  const grandTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <h2 className="text-xl font-bold text-yellow-600 mb-3">Order Summary</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No items in cart</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id} className="flex justify-between mb-2">
              <span>{item.name} x {item.qty}</span>
              <span className="text-yellow-600">${item.price * item.qty}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t mt-2 pt-2 flex justify-between font-bold text-red-600">
        <span>Total:</span>
        <span>${grandTotal}</span>
      </div>
    </div>
  );
}

export default OrderSummary;