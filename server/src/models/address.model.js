import mongoose from 'mongoose'
const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    Country: {
        type: String,
        required: true
    },
    phone: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    }
  },
  { timestamps: true },
);

export const Address = mongoose.model('Address', addressSchema);
