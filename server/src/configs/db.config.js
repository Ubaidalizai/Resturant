import mongoose from "mongoose";
import { ensureDefaultAccounts } from "../services/accounting.service.js";
import { Menue } from "../models/menue.model.js";

const dropStaleMenuNameIndex = async () => {
  try {
    const indexes = await Menue.collection.indexes();
    const nameIndex = indexes.find(
      (idx) => idx.key?.name === 1 && idx.unique === true
    );
    if (nameIndex) {
      await Menue.collection.dropIndex(nameIndex.name);
      console.log("Dropped stale unique index on menu name");
    }
  } catch (error) {
    if (error.code !== 27) {
      console.log("Menu index cleanup:", error.message);
    }
  }
};

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    if (mongoose.connection.readyState === 1) {
      console.log("DB Connected");
      await dropStaleMenuNameIndex();
      await ensureDefaultAccounts();
    }
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected — attempting reconnect");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
