import { Router } from "express";
import { createCurrentUser, updateCurrentUser } from "../controllers";
import { jwtCheck, jwtParse, validateMyUserRequest } from "../middleware";


const router = Router();

/// /api/my/user
router.post("/", jwtCheck, createCurrentUser);
router.put("/",
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    updateCurrentUser
);


export default router;