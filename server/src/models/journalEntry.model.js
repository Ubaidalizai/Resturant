import mongoose from "mongoose";

const journalLineSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    debit: { type: Number, default: 0, min: 0 },
    credit: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const journalEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true, trim: true },
    referenceType: {
      type: String,
      enum: ["expense", "salary", "revenue", "loss", "manual"],
      required: true,
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    lines: {
      type: [journalLineSchema],
      validate: {
        validator: (lines) => Array.isArray(lines) && lines.length >= 2,
        message: "A journal entry must have at least two lines",
      },
    },
    totalDebit: { type: Number, required: true },
    totalCredit: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
