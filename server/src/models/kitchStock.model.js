// models/stock.model.js

import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "low", "out-of-stock"],
      default: "available",
    },
    unit: {
        type: String, 
        enum: ["kg", "liter", "pieces", "man", 'gram', 'ml'],
        default: "kg"
    },
    
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

export const Stock = mongoose.model("Stock", stockSchema);