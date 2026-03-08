function MenuTabs({ menus, selectedMenu, setSelectedMenu }) {
  return (
    <div className="mb-6">
      <select
        value={selectedMenu || menus[0]?._id}
        onChange={(e) => setSelectedMenu(e.target.value)}
        className="w-full md:w-64 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        {menus.map((menu) => (
          <option key={menu._id} value={menu._id}>
            {menu.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MenuTabs;