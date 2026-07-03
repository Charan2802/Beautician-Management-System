import express from "express";

import {
  getLeaves,
  createLeave,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

const router = express.Router();

router.get("/", getLeaves);

router.post("/", createLeave);

router.put("/:id", updateLeaveStatus);

export default router;