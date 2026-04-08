import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.middleware";
import {
  addAdress,
  deleteAddress,
  getAddress,
  setDefaultAddress,
  updatedAddress,
} from "../controllers/userController";

router.post("/", protect, addAdress);
router.get("/", protect, getAddress);
router.patch("/:id/default", protect, setDefaultAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id", protect, updatedAddress);
