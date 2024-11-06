import { Router } from "express";
import { jwtCheck, jwtParse } from "../../middleware";
import { createCheckoutSession } from "../../controllers";

const router = Router();

router.post("/checkout/create-checkout-session",
    jwtCheck,
    jwtParse,
    createCheckoutSession
);


export default router; 