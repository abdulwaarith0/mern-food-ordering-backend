import Stripe from "stripe";
import { STRIPE_API_KEY, FRONTEND_URL, STRIPE_WEBHOOK_SECRET } from "../../constants";
import { Request, Response } from "express";
import { IErrorResponse } from "../types";
import { Restaurant, Order } from "../../models";
import { IMenuItem } from "../../models/restaurant";


const STRIPE = new Stripe(STRIPE_API_KEY as string);
const Frontend_URL = FRONTEND_URL as string;

export type ICheckoutSession = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
        country: string;
    };
    restaurantId: string;
}

export const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event;

    try {
        const sig = req.headers['stripe-signature'] as string;
        event = STRIPE.webhooks.constructEvent(req.body,
            sig, STRIPE_WEBHOOK_SECRET);

    } catch (error: any) {
        const result: IErrorResponse = {
            code: 400,
            message: `Webhook Error: ${error.message}`,
        };
        res.status(400).json(result);
        return;
    }

    if (event.type === "checkout.session.completed") {
        const order = await Order.findById(event.data.object.metadata?.orderId);

        if (!order) {
            const result: IErrorResponse = {
                code: 404,
                message: "Order not found",
            };
            res.status(404).json(result);
            return;
        }

        order.totalAmount = event.data.object.amount_total;
        order.status = "paid";
        await order.save();
    }

    res.status(200).send();
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("restaurant")
            .populate("user");

        res.json(orders);

    } catch (error: any) {
        const result: IErrorResponse = {
            code: 500,
            message: "Failed to get orders",
        };
        res.status(500).json(result);
    }
};


export const createCheckoutSession = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const checkoutSessionRequest: ICheckoutSession = req.body;

        const restaurant =
            await Restaurant.findById(checkoutSessionRequest.restaurantId);

        if (!restaurant) {
            const result: IErrorResponse = {
                code: 404,
                message: "Restaurant not found",
            };
            res.status(404).json(result);
            return;
        }

        const newOrder = new Order({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
        });

        const lineItems = createLineItems(
            checkoutSessionRequest,
            restaurant.menuItems
        );

        const session = await createSession(
            lineItems.lineItems,
            newOrder._id.toString(),
            restaurant.deliveryPrice,
            restaurant._id.toString()
        );

        if (!session.url) {
            const result: IErrorResponse = {
                code: 500,
                message: "Failed to create stripe checkout session",
            };
            res.status(500).json(result);
            return;
        }

        await newOrder.save();
        res.json({ url: session.url });

    } catch (error: any) {
        const result: IErrorResponse = {
            code: 500,
            message: error.raw.message,
        };
        res.status(500).json(result);
    }
}


export const createLineItems = (
    checkoutSessionRequest: ICheckoutSession,
    menuItems: IMenuItem[],
    currency: string = "gbp"            // Default currency set to GBP
): {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    errors: IErrorResponse[]
} => {

    // Convert array to map for quicker access
    const menuItemsMap = new Map(menuItems.map(item => [item._id.toString(), item]));

    const errors: IErrorResponse[] = [];
    const lineItems = checkoutSessionRequest.cartItems.reduce((acc, cartItem) => {
        const menuItem = menuItemsMap.get(cartItem.menuItemId.toString());

        if (!menuItem) {
            errors.push({
                code: 404,
                message: `Menu item not found: ${cartItem.menuItemId}`
            });
            return acc;
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: currency,
                unit_amount: menuItem.price,
                product_data: {
                    name: menuItem.name,
                },
            },
            quantity: parseInt(cartItem.quantity),
        };

        acc.push(line_item);
        return acc;
    }, [] as Stripe.Checkout.SessionCreateParams.LineItem[]);

    return { lineItems, errors };
};

export const createSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string,
    deliveryPrice: number,
    restaurantId: string
) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice,
                        currency: "gbp",
                    },
                },
            },
        ],
        mode: "payment",
        metadata: {
            orderId: orderId,
            restaurantId,
        },
        success_url: `${Frontend_URL}/order-status/?success=true`,
        cancel_url: `${Frontend_URL}/detail/${restaurantId}?cancelled=true`,
    });

    return sessionData;
}