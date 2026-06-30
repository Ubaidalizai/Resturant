import { Loss } from "../models/loss.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { recordLossEntry } from "../services/accounting.service.js";

export const addLoss = asyncHandler(async (req, res) => {
  const { title, amount, note, date } = req.body;

  const loss = await Loss.create({
    title,
    amount,
    note: note || "",
    lossDate: date,
  });

  try {
    await recordLossEntry({
      lossId: loss._id,
      amount: Number(amount),
      title,
      userId: req.user?.id,
    });
  } catch (err) {
    await Loss.findByIdAndDelete(loss._id);
    throw err;
  }

  res.respond(201, "Loss added successfully", loss);
});

export const getAllLosses = asyncHandler(async (req, res) => {
  const losses = await Loss.find({ isDeleted: false }).sort({ lossDate: -1, createdAt: -1 });
  res.respond(200, "Losses fetched successfully", losses);
});

