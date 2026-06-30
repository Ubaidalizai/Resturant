function OrderCard({ order, itemNames, total, loadOrderToCart }) {
  return (
    <div
      className="erp-panel p-4 w-64 cursor-pointer hover:bg-slate-50"
      onClick={() => loadOrderToCart(order)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && loadOrderToCart(order)}
    >
      <p className="text-xs text-slate-500 uppercase tracking-wide">Table {order.tableNumber}</p>
      <p className="font-semibold text-slate-800 mt-1 text-sm">{itemNames}</p>
      <p className="text-red-600 font-semibold mt-2">${total}</p>
      <span className="erp-badge erp-badge-info mt-2">{order.status}</span>
    </div>
  );
}

export default OrderCard;
