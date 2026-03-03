function MenuTabs({ menus, selectedMenu, setSelectedMenu }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {menus.map((menu) => (
        <button
          key={menu._id}
          onClick={() => setSelectedMenu(menu._id)}
          className={`px-6 py-3 rounded-xl font-bold transition shadow-sm
            ${
              selectedMenu === menu._id
                ? "bg-yellow-600 text-white"
                : "bg-white border border-gray-300 text-black hover:bg-gray-100"
            }
          `}
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
}

export default MenuTabs;