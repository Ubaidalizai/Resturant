import mongoose from 'mongoose';
const RestaurentSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    openingTime: {
        type: String, 
        required: true
    },
    closingTime: {
        type: String, 
        required: true
    }, 
}, {timestamps: true});

export const RestaurantInfo = mongoose.model('Restaurent', RestaurentSchema);
