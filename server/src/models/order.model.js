import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items:[{product: String, productId: {type: mongoose.Types.ObjectId, ref: "Product"}}],
    quantity: {type: Number, required: true},
    amount: {type: Number, required: true},
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);
