import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: { 
        type: String, 
        required: true 
    },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'  },
        quantity: { type: Number, default: 1},
        size: {type: Number},
        price: {type: Number}
    }]
}, { 
    timestamps: true
});

export default mongoose.model("Cart", cartSchema)