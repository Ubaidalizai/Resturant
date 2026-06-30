function MenuTabs({ menus, selectedMenu, setSelectedMenu }) {
  return (
    <select
      value={selectedMenu || menus[0]?._id}
      onChange={(e) => setSelectedMenu(e.target.value)}
      className="erp-select w-full md:w-56"
    >
      {menus.map((menu) => (
        <option key={menu._id} value={menu._id}>{menu.name}</option>
      ))}
    </select>
  );
}

export default MenuTabs;
