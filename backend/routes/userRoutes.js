import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.middleware.js";
import {
  addAdress,
  deleteAddress,
  getAddress,
  setDefaultAddress,
  updatedAddress,
  updateProfile,
} from "../controllers/userController.js";

router.put("/profile", protect, updateProfile);

router.post("/", protect, addAdress);
router.get("/", protect, getAddress);
router.patch("/:id/default", protect, setDefaultAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id", protect, updatedAddress);

export default router;
