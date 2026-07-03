import express from "express";

import {
  recordPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  generateInvoicePdf,
  monthlyRevenue,
} from "../controllers/paymentController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

import {
    authorizeRoles,
} from "../middleware/roleMiddleware.js";

const router =
    express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("Admin"),
    recordPayment
);

router.get(
    "/",
    protect,
    authorizeRoles("Admin"),
    getPayments
);

router.get(
    "/revenue",
    protect,
    authorizeRoles("Admin"),
    monthlyRevenue
);

router.get(
    "/invoice/:id",
    protect,
    authorizeRoles("Admin"),
    generateInvoicePdf
);

router.get(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    getPaymentById
);

router.put(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    updatePayment
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    deletePayment
);


export default router;