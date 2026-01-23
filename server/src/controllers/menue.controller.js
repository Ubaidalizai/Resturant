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
  const menues = await Menue.find({});
  res.respond(200, "Menues fetched successfully", menues);
});

// Delete menue
export const deleteMenue = asyncHandler(async (req, res) => {
  const { menueId } = req.params;
  await Menue.findByIdAndDelete(menueId);
  res.respond(200, "Menue deleted successfully");
});

