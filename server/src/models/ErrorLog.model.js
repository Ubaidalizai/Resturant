import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema({
    message: { type: String, required: true },
    stack: { type: String },
    route: { type: String },
    method: { type: String },
    StatusCode: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    resolved: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

export const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);
