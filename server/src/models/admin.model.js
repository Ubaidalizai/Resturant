import mongoose from "mongoose";
import bcrypt from 'bcrypt'
export const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

adminSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.model('Admin', adminSchema);
