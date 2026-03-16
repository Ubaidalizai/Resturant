import TableSelector from "./TableSelector";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApi } from '../../context/ApiContext';
import InputField from "../UI/InputField";
import Button from "../UI/Button";

function CartPanel({
  cart,
  setCart,
  tables,
  selectedTable,
  setSelectedTable,
  currentOrderId,
  setCurrentOrderId,
  customer,
  setCustomer
}) {

  const { post, put } = useApi();
  const { t } = useTranslation("common");

  const items = Object.values(cart);

  const grandTotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const removeItem = (id) => {
    const copy = { ...cart };
    delete copy[id];
    setCart(copy);
  };

  const confirmOrder = async () => {

    if (!selectedTable)
      return toast.error(t("SelectATableFirst", { defaultValue: "Select a table first" }));

    if (items.length === 0)
      return toast.error(t("AddSomeFoodFirst", { defaultValue: "Add some food first" }));

    if (!customer || customer.trim() === "")
      return toast.error(t("PleaseEnterCustomerName", { defaultValue: "Please enter customer name" }));

    try {

      const orderItems = items.reduce((acc, item) => {
        acc[item._id] = { quantity: item.qty };
        return acc;
      }, {});

      if (currentOrderId) {

        await put(
          `/api/v1/orders/update/${currentOrderId}`,
          { items: orderItems },
          { withCredentials: true }
        );

        toast.success("Order updated successfully!");

      } else {

        await post(
          `/api/v1/orders/add`,
          {
            tableId: selectedTable,
            items: items.map(item => ({
              foodId: item._id,
              quantity: item.qty
            })),
            customer
          },
          { withCredentials: true }
        );

        toast.success("Order placed successfully!");
      }

      setCart({});
      setSelectedTable("");
      setCurrentOrderId(null);
      setCustomer("");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        err.message ||
        t("ErrorProcessingOrder", { defaultValue: "Error processing order" })
      );
    }
  };

  return (
    <div className="sticky top-0 h-screen w-full md:w-80 bg-gray-50 shadow-xl p-6 flex flex-col">

      <h2 className="text-2xl font-bold text-yellow-600 mb-4">
        Cart
      </h2>

      <div className="mb-4">

        <label className="block text-gray-700 font-bold mb-2">
          Customer Name
        </label>

        <InputField
          type="text"
          placeholder="Enter customer name"
          className="border placeholder:text-gray-500 rounded py-2 text-black px-3 border-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-yellow-600"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

      </div>

      <TableSelector
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />

      <div className="flex-1 overflow-y-auto mb-4">

        {items.length === 0 ? (

          <p className="text-gray-500">
            {t("NoItemsInCart", { defaultValue: "No items in cart" })}
          </p>

        ) : (

          items.map(item => (

            <div
              key={item._id}
              className="flex justify-between items-center mb-3 bg-white p-2 rounded shadow-sm"
            >

              <div>
                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-yellow-600">
                  ${item.price} x {item.qty}
                </p>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="text-red-600 font-bold"
              >
                ×
              </button>

            </div>

          ))

        )}

      </div>

      <div className="mt-auto">

        <h3 className="font-bold text-lg text-red-600 mb-4">
          Total: ${grandTotal}
        </h3>

        <Button
          onClick={confirmOrder}
          className="w-full bg-green-600"
        >
          {currentOrderId ? "Update Order" : "Confirm Order"}
        </Button>

      </div>

    </div>
  );
}

export default CartPanel;