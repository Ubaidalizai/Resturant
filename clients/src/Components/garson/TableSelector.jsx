function TableSelector({ tables, selectedTable, setSelectedTable }) {
  return (
    <select
      value={selectedTable || ""}
      onChange={(e) => setSelectedTable(e.target.value)}
      className="erp-select"
    >
      <option value="">Select table</option>
      {tables.map((table) => (
        <option key={table._id} value={table._id}>Table {table.tableNumber}</option>
      ))}
    </select>
  );
}

export default TableSelector;
