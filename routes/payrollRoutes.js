import express from "express";

import {
  getPayrolls,
  createPayroll,
  markPayrollPaid,
} from "../controllers/payrollController.js";

const router = express.Router();

router.get("/", getPayrolls);
router.post("/", createPayroll);
router.put("/pay/:id", markPayrollPaid);

export default router;