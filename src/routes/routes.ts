import { Router } from "express";
import { createCurrentUser } from "../controllers";
import { jwtCheck } from "../middleware";


const router = Router();

/// /api/my/user
router.post("/", jwtCheck, createCurrentUser);

export default router;
