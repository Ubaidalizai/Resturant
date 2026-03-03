import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Menue } from "../models/menue.model.js";
// Add new menue
export const addMenue = asyncHandler(async (req, res) => {
  const { name, catagory } = req.body;
  const newMenue = await Menue.create({ name, catagory });
  res.respond(201, "Menue added successfully", newMenue);
});
// Get all menues
export const getMenues = asyncHandler(async (req, res) => {
  const menues = await Menue.find({isDeleted: false});
  res.respond(200, "Menues fetched successfully", menues);
});

// Delete menue
export const deleteMenue = asyncHandler(async (req, res) => {
  const { menueId } = req.params;
  await Menue.findByIdAndUpdate(menueId, {isDeleted: true});
  res.respond(200, "Menue deleted successfully");
});

// Update the menue
export const updateMenue = asyncHandler(async (req, res) => {
  const { menuId } = req.params;
  const { name, category } = req.body;

  const menuFound = await Menue.findById(menuId);
  if (!menuFound) {
    return res.respond(404, "Menue not found");
  }

  const updatedMenu = await Menue.findByIdAndUpdate(
    menuId,
    { name, category },
    { new: true, runValidators: true }
  );

  console.log(updatedMenu);

  res.respond(200, "Menue updated successfully", updatedMenu);
});