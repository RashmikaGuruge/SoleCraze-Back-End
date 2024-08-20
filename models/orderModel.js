import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: { 
        type: String, 
        required: true 
    },
    products: [{
        productId: { type: String },
        quantity: { type: Number, default: 1},
    }],
    amount: { 
        type: Number, 
        required: true 
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    payment_intent: {
        type: String,
        required: true,
    },
}, {
    timestamps:true
});

export default mongoose.model("Order", orderSchema)