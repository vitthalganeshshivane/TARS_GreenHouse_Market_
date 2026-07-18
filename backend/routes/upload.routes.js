import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadImage);

export default router;
