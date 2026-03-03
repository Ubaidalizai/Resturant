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
    },
    isDeleted: {
        type: Boolean, 
        default: false
    }
}, {timestamps: true});

export const Menue = mongoose.model("Menue", menueSchema);