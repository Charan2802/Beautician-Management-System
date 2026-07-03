import express from "express";

import {
  reportSummary,
  serviceRevenue,
  paymentMethods,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/summary", reportSummary);

router.get(
  "/service-revenue",
  serviceRevenue
);

router.get(
  "/payment-methods",
  paymentMethods
);

export default router;