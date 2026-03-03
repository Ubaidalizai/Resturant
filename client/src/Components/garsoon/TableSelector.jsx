function TableSelector({ tables, selectedTable, setSelectedTable }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold text-black">Select Table</label>
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold"
      >
        <option value="">Select Table</option>
        {tables.map((t) => (
          <option key={t._id} value={t._id}>
            Table {t.tableNumber}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TableSelector;