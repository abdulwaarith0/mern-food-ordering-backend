import { Router } from "express";
import { jwtCheck, jwtParse } from "../../middleware";
import { createCheckoutSession, stripeWebhookHandler } from "../../controllers";

const router = Router();

router.post("/checkout/create-checkout-session",
    jwtCheck,
    jwtParse,
    createCheckoutSession
);

// webhook
router.post("/checkout/webhook", stripeWebhookHandler);


export default router; 