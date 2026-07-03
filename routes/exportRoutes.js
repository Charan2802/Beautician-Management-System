import express from "express";

import {
  exportRevenue,
  exportPayments,
  exportAppointments,
  exportDashboard,
} from "../controllers/exportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/revenue",
  protect,
  authorizeRoles("Admin"),
  exportRevenue
);

router.get(
  "/payments",
  protect,
  authorizeRoles("Admin"),
  exportPayments
);

router.get(
  "/appointments",
  protect,
  authorizeRoles("Admin"),
  exportAppointments
);

router.get(
  "/dashboard",
  protect,
  authorizeRoles("Admin"),
  exportDashboard
);

export default router;