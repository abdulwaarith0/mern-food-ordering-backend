import { Router } from "express";
import { jwtCheck, jwtParse } from "../../middleware";
import { createCheckoutSession, stripeWebhookHandler, getMyOrders } from "../../controllers";

const router = Router();

// get all orders
router.get("/", jwtCheck, jwtParse, getMyOrders);

router.post("/checkout/create-checkout-session",
    jwtCheck,
    jwtParse,
    createCheckoutSession
);

// webhook
router.post("/checkout/webhook", stripeWebhookHandler);

export default router;