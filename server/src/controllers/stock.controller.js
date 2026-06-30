import { Stock } from "../models/kitchStock.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
// Create new stock item
export const createStock = asyncHandler(async (req, res) => {
  const { item, quantity, unit } = req.body;

  // Check if item already exists (not deleted)
  const existing = await Stock.findOne({ item: item.trim(), isDeleted: false });
  if (existing) {
    return res.respond(400, "Stock with this item name already exists");
  }

  // Determine status based on quantity
  let status = "available";
  if (quantity === 0) status = "out-of-stock";
  else if (quantity <= 10) status = "low";

  const stock = await Stock.create({
    item: item.trim(),
    quantity,
    unit,
    status
  });

  res.respond(201, "Stock created successfully", stock);
});
// Get all stocks (not deleted)
export const getAllStock = asyncHandler(async (req, res) => {
  const stocks = await Stock.find({ isDeleted: false }, {isDeleted: 0}).sort({ createdAt: -1 });
  res.respond(200, "Stocks fetched successfully", stocks);
});

// Get single stock (not deleted)
export const getSingleStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findOne({ _id: req.params.id, isDeleted: false }, {isDeleted: 0} );
  if (!stock) return res.respond(404, "Stock not found");
  res.respond(200, "Stock fetched successfully", stock);
});

// Update stock
export const updateStock = asyncHandler(async (req, res) => {
  const { item, quantity, unit, description } = req.body;
  const stock = await Stock.findOne({ _id: req.params.id, isDeleted: false }, {isDeleted: 0});
  if (!stock) return res.respond(404, "Stock not found");

  if (item) stock.item = item;
  if (unit) stock.unit = unit;
  if (description) stock.description = description;

  if (quantity !== undefined) {
    stock.quantity = quantity;

    if (quantity === 0) stock.status = "out-of-stock";
    else if (quantity <= 10) stock.status = "low";
    else stock.status = "available";
  }

  await stock.save();
  res.respond(200, "Stock updated successfully", stock);
});

// Soft delete stock
export const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  if (!stock) return res.respond(404, "Stock not found");

  stock.isDeleted = true;
  await stock.save();
  res.respond(200, "Stock deleted successfully");
});

// Get all active stock items (isDeleted: false)
export const getActiveStock = asyncHandler(async (req, res) => {
  const stocks = await Stock.find({ isDeleted: false }).sort({ createdAt: -1 });
  if (!stocks.length) return res.respond(404, "No active stock items found");
  res.respond(200, "Active stock items fetched successfully", stocks);
});

// Optional: Get stock by status (available, low, out-of-stock)
export const getStockByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;

  if (!["available", "low", "out-of-stock"].includes(status)) {
    return res.respond(400, "Invalid status query. Use available, low, or out-of-stock");
  }

  const stocks = await Stock.find({ status, isDeleted: false }).sort({ createdAt: -1 });
  if (!stocks.length) return res.respond(404, `No stock items found with status: ${status}`);

  res.respond(200, `Stock items with status '${status}' fetched successfully`, stocks);
});