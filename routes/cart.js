import express from "express";
import {
  createCart,deleteCart,updateCart,getCart,removeProductFromCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", createCart);
router.delete("/:id", deleteCart);
router.put("/:userId", updateCart);
router.get("/:userId", getCart);
router.delete("/:userId/:productId", removeProductFromCart)

export default router;