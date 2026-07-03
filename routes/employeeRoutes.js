import express from "express";

import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} from "../controllers/employeeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * ALL ROUTES ARE ADMIN ONLY
 */

router.post("/", protect, authorizeRoles("Admin"), addEmployee);

router.get("/", protect, authorizeRoles("Admin"), getEmployees);

router.put("/:id", protect, authorizeRoles("Admin"), updateEmployee);

router.delete("/:id", protect, authorizeRoles("Admin"), deleteEmployee);

router.patch(
  "/toggle-status/:id",
  protect,
  authorizeRoles("Admin"),
  toggleEmployeeStatus
);

export default router;