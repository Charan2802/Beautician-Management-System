import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  uploadProfileImage,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* PUBLIC ROUTES */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* PROFILE ROUTES */
router.get("/me", protect, getMe);

router.put(
  "/update-profile",
  protect,
  updateProfile
);

router.put(
  "/upload-profile",
  protect,
  upload.single("image"),
  uploadProfileImage
);

export default router;