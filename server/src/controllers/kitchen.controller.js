import {asyncHandler} from '../utils/asyncHandler.util.js';
import ErrorHandler from '../utils/errorHandler.util.js';
import {KitchenStock} from '../models/kitchenStock.model.js'
// Add the stock
export const addStock = asyncHandler(async (req, res, next)=>{
    const {name, quantity, unit, minRequired, status} = req.body;
    // Check if the items is already in the stock 
    const itemFound = await KitchenStock.findOne({name, isDeleted: false });
    if(itemFound)return next(new ErrorHandler(400, "Item already exists"));
    // Insert the items in DB
   await KitchenStock.create({name, quantity, unit, minRequired, status})
   res.respond(201, "Item added successfully");
});

// Get all the items 
export const getAllItems = asyncHandler(async (req, res, next)=>{
    const items = await KitchenStock.find({isDeleted: false});
    res.respond(200, "Items fetched successfully", items);
}) 

// Delete the item
export const deleteItem = asyncHandler(async (req, res, next)=>{
    const {id}  = req.params;
    const items = await KitchenStock.findByIdAndUpdate(id,{isDeleted: true});
    console.log(items);
    if(!items)return next(new ErrorHandler(400, "Item does not exists"));
    res.respond(200, "Items deleted successfully");
});

// Update the item 
export const updateItem = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, quantity, unit, minRequired, status } = req.body;
    const item = await KitchenStock.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, quantity, unit, minRequired, status },
        { new: true }
    );
    if (!item) {
        return next(new ErrorHandler(404, "Item not found"));
    }
    res.respond(200, "Item updated successfully", item);
});
