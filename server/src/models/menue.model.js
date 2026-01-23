import mongoose from 'mongoose';
export const menueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    catagory: {
        type: String, 
        required: true
    }
}, {timestamps: true});

export const Menue = mongoose.model("Menue", menueSchema);