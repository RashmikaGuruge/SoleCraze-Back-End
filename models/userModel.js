import mongoose from "mongoose";
const { Schema } = mongoose;
import { v4 as uuidv4 } from "uuid";

const userSchema = new Schema({
  _id: { 
    type: String,  
    default: uuidv4 
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
