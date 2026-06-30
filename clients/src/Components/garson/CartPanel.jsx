import { useState } from "react";
import TableSelector from "./TableSelector";
import { toast } from "react-toastify";
import { useTranslation } from "../../../node_modules/react-i18next";
import { useApi } from '../../context/ApiContext';
import { getTranslatedServerMessage } from "../../utils/serverMessageTranslator";
import InputField from "../UI/InputField";
import Button from "../UI/Button";

function CartPanel({
  cart, setCart, tables, selectedTable, setSelectedTable,
  currentOrderId, setCurrentOrderId, customer, setCustomer, onOrderPlaced,
}) {
  const { post, put } = useApi();
  const { t } = useTranslation("common");
  const [errors, setErrors] = useState({});
  const items = Object.values(cart);
  const grandTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const removeItem = (id) => {
    const copy = { ...cart };
    delete copy[id];
    setCart(copy);
  };

  const confirmOrder = async () => {
    const newErrors = {};
    if (!selectedTable) newErrors.table = t("SelectATableFirst", { defaultValue: "Select a table first" });
    if (items.length === 0) newErrors.cart = t("AddSomeFoodFirst", { defaultValue: "Add some food first" });
    if (!customer?.trim()) newErrors.customer = t("PleaseEnterCustomerName", { defaultValue: "Please enter customer name" });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      if (currentOrderId) {
        await put(`/api/v1/orders/update/${currentOrderId}`, {
          tableId: selectedTable,
          customer,
          items: items.map((item) => ({ foodId: item._id, quantity: item.qty })),
        }, { withCredentials: true });
        toast.success(t("OrderUpdatedSuccessfully", { defaultValue: "Order updated successfully" }));
      } else {
        await post(`/api/v1/orders/add`, {
          tableId: selectedTable,
          items: items.map((item) => ({ foodId: item._id, quantity: item.qty })),
          customer,
        }, { withCredentials: true });
        toast.success(t("OrderPlacedSuccessfully", { defaultValue: "Order placed successfully" }));
      }

      setCart({});
      setSelectedTable("");
      setCurrentOrderId(null);
      setCustomer("");
      setErrors({});
      onOrderPlaced?.();
    } catch (err) {
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("ErrorProcessingOrder", { defaultValue: "Error processing order" }));
    }
  };

  return (
    <div className="garson-cart sticky top-0 h-auto md:h-screen w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-5 flex flex-col shrink-0">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">
        {t("Cart", { defaultValue: "Cart" })}
      </h2>

      <InputField
        label={t("CustomerName", { defaultValue: "Customer Name" })}
        type="text"
        placeholder={t("EnterCustomerName", { defaultValue: "Enter customer name" })}
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        error={errors.customer}
      />

      <div className="form-field mb-3">
        <label className="erp-label">{t("Table", { defaultValue: "Table" })}</label>
        <TableSelector tables={tables} selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
        {errors.table && <p className="form-error">{errors.table}</p>}
      </div>

      {errors.cart && <p className="form-error mb-2">{errors.cart}</p>}

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">{t("NoItemsInCart", { defaultValue: "No items in cart" })}</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="flex justify-between items-center border border-slate-200 p-2 bg-slate-50">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-blue-700 text-sm">${item.price} × {item.qty}</p>
              </div>
              <button type="button" onClick={() => removeItem(item._id)} className="text-red-600 font-bold text-lg">×</button>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <h3 className="font-semibold text-base text-slate-800 mb-3">
          {t("Total", { defaultValue: "Total" })}: <span className="text-red-600">${grandTotal}</span>
        </h3>
        <Button onClick={confirmOrder} variant="success" className="w-full">
          {currentOrderId ? t("UpdateOrder", { defaultValue: "Update Order" }) : t("ConfirmOrder", { defaultValue: "Confirm Order" })}
        </Button>
      </div>
    </div>
  );
}

export default CartPanel;
