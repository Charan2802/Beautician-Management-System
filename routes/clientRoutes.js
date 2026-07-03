import express from "express";

import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

import {
  createClientValidator,
  updateClientValidator,
} from "../validators/clientValidator.js";

import { validate } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
=========================================
Create Client
=========================================
*/
router.post(
  "/",
  protect,
  authorizeRoles("Admin"),
  createClientValidator,
  validate,
  createClient
);

/*
=========================================
Get All Clients
=========================================
*/
router.get(
  "/",
  protect,
  authorizeRoles("Admin"),
  getClients
);

/*
=========================================
Update Client
=========================================
*/
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateClientValidator,
  validate,
  updateClient
);

/*
=========================================
Delete Client
=========================================
*/
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteClient
);

export default router;