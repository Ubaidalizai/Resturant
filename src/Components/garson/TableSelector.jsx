import { useTranslation } from "react-i18next";

function TableSelector({ tables, selectedTable, setSelectedTable }) {
  const { t } = useTranslation("common");

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold text-black">{t("SelectTable", { defaultValue: "Select Table" })}</label>
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold"
      >
        <option value="">{t("SelectTable", { defaultValue: "Select Table" })}</option>
        {tables.map((table) => (
          <option key={table._id} value={table._id}>
            {t("TableWithNumber", { defaultValue: "Table {{number}}", number: table.tableNumber })}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TableSelector;