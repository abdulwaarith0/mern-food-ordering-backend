import { Router } from "express";
import { createCurrentUser } from "../controllers";

const router = Router();

/// /api/my/user
router.post("/", createCurrentUser);

export default router;
