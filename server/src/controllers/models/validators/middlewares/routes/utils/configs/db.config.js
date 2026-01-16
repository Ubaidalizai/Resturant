import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
       
        const db = await mongoose.connect(process.env.MONGO_URI);
        if(db.connections[0].readyState == 1)console.log(`DB Connected`);
    } catch (error) {
        console.log(`DB Connection Failed: Error ${error}`);
    }
}