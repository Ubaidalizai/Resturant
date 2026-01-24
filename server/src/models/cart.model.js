import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    items: {
        productId: mongoose.Types.ObjectId,
        quantity: Number
    }
}, {timestampe:true});

export const Cart = mongoose.model("Cart", cartSchema);