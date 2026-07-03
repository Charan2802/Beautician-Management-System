import express from "express";

import {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
=================================
MARK ATTENDANCE
=================================
POST /api/attendance
*/
router.post(
  "/",
  protect,
  authorizeRoles(
      "Admin",
      "Employee"
  ),
  markAttendance
);

/*
=================================
GET ATTENDANCE
=================================
GET /api/attendance
*/
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Employee"),
  getAttendance
);

/*
=================================
UPDATE ATTENDANCE
=================================
PUT /api/attendance/:id
*/
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateAttendance
);

/*
=================================
DELETE ATTENDANCE
=================================
DELETE /api/attendance/:id
*/
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteAttendance
);

/*
=================================
EXPORT DEFAULT
=================================
*/
export default router;