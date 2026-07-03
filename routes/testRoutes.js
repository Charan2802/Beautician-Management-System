import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Admin only route
 */
router.get(
  "/admin",
  protect,
  authorizeRoles("Admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin Panel",
      user: req.user,
    });
  }
);

/**
 * Employee + Admin route
 */
router.get(
  "/dashboard",
  protect,
  authorizeRoles("Admin", "Employee"),
  (req, res) => {
    res.json({
      message: "Shared Dashboard Access",
      user: req.user,
    });
  }
);

export default router;