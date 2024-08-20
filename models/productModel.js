import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true,
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  starNumber: {
    type: Number,
    default: 0,
  },
  size: {
    type: [Number],
    required: true
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
    required: true,
  },
  status: {
    type: String,
    default: "active",
    required: true,
  },
  cat: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  imgs: {
    type: [String],
    required: true,
  },
},{
  timestamps:true
});

export default mongoose.model("Product", productSchema)