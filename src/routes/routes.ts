import { Router } from "express";
import { createCurrentUser, getCurrentUser, updateCurrentUser } from "../controllers";
import { jwtCheck, jwtParse, validateMyUserRequest } from "../middleware";


const router = Router();

/// /api/my/user
// Get current user
router.get("./", jwtCheck, jwtParse, getCurrentUser);

// Create a new user
router.post("/", jwtCheck, createCurrentUser);

// Update current user
router.put("/",
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    updateCurrentUser
);


export default router;