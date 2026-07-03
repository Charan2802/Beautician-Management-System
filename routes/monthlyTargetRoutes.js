import express from "express";

import {
    createTarget,
    getTargets,
    updateTarget,
    deleteTarget,
    updateProgress,
}
from "../controllers/monthlyTargetController.js";

const router =
express.Router();

router.post(
    "/",
    createTarget
);

router.get(
    "/",
    getTargets
);

router.put(
    "/:id",
    updateTarget
);

router.delete(
    "/:id",
    deleteTarget
);

router.put(
    "/progress/update",
    updateProgress
);

export default router;