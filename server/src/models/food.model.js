import mongoose from 'mongoose';

const productSchema  = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    catagory: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    image:{
        type: String, 
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export const Food = mongoose.model("Food", productSchema);

