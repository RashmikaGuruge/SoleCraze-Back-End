import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.delete("/:id",verifyToken, deleteProduct);
router.put("/:id", verifyToken, updateProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;