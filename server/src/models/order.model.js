import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items:[{product: String, productId: {type: mongoose.Types.ObjectId, ref: "Product"}}],
    quantity: {type: Number, required: true},
    amount: {type: Number, required: true},
    address: {type: mongoose.Types.ObjectId, required: true, ref: 'Address'},
    status: {type: String, default: "Order Placed"},
    isPaid: {type: Boolean, required: false},
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);
