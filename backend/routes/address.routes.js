import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  getSingleAddress,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createAddress);
router.get("/", protect, getAddresses);
router.get("/:id", protect, getSingleAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.patch("/:id/default", protect, setDefaultAddress);

export default router;
