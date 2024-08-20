import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getUsers, deleteUsers, getUser, updateUser, getUserStats } from "../controllers/userController.js"

const router = express.Router();

router.get("/", verifyToken, getUsers)
router.delete("/:id", verifyToken, deleteUsers)
router.get("/:id", verifyToken, getUser)
router.put("/:id", verifyToken, updateUser)
router.get("/stats", verifyToken, getUserStats)

export default router;