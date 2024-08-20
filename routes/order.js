import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { intent, getOrders, confirm, getAllOrders, getMonthlyIncome, getMonthlyProductIncome } from "../controllers/orderController.js";

const router = express.Router();

router.get("/:userId", verifyToken, getOrders);
// router.post("/:gigId", verifyToken, createOrder);
router.post("/create-payment-intent/:cartId", verifyToken, intent);
router.put("/", verifyToken, confirm);
router.get("/", verifyToken, getAllOrders);
router.get("/income", verifyToken, getMonthlyIncome);
router.get("/income/:pid", verifyToken, getMonthlyProductIncome);

export default router;