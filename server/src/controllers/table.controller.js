import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Table } from "../models/table.model.js";

// Add new table
const addTable = asyncHandler(async (req, res)=>{
    const { tableNumber, capacity } = req.body;
    const newTable = await Table.create({ tableNumber, capacity });
    res.respond(201, "Table added successfully", newTable);
});

// Get all tables
const getTables = asyncHandler(async (req, res)=>{
    const tables = await Table.find({});
    res.respond(200, "Tables fetched successfully", tables);
});

// Delete table
const deleteTable = asyncHandler(async (req, res)=>{
    const { tableId } = req.params;
    await Table.findByIdAndDelete(tableId);
    res.respond(200, "Table deleted successfully");
});

export { addTable, getTables, deleteTable };