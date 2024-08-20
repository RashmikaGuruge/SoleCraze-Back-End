import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import user from "./routes/user.js";
import order from "./routes/order.js";
import review from "./routes/review.js";
import auth from "./routes/auth.js";
import cart from "./routes/cart.js";
import product from "./routes/product.js";
import cors from "cors";

const app = express();
dotenv.config();
const dbUrl = 'mongodb://127.0.0.1:27017/soleCraze';
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

const adminUrl = "http://localhost:5174";
const clientUrl = "http://localhost:5173";

app.use(cors({
  origin: [adminUrl, clientUrl], // Allow requests from both admin and client URLs
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', user);
app.use('/api/auth', auth);
app.use('/api/reviews', review);
app.use('/api/orders', order);
app.use('/api/cart', cart);
app.use('/api/products', product);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
})

app.listen(8800, ()=>{
    connect();
    console.log("Backend Server is running!")
})