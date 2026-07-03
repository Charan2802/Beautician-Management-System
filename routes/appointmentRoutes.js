import express from "express";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updateStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * CREATE
 */
router.post(
  "/",
  protect,
  authorizeRoles("Admin"),
  createAppointment
);

/**
 * GET ALL
 */
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Employee"),
  getAppointments
);

/**
 * GET BY ID
 */
router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "Employee"),
  getAppointmentById
);

/**
 * UPDATE FULL APPOINTMENT
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateAppointment
);

/**
 * UPDATE STATUS ONLY (IMPORTANT FOR YOUR UI)
 */
router.patch(
  "/status/:id",
  protect,
  authorizeRoles("Admin", "Employee"),
  updateStatus
);

/**
 * DELETE
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteAppointment
);

export default router;