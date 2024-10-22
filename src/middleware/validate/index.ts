import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";


export const handleValidationErrors = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
}


export const validateMyUserRequest = [
    body("name")
        .isString()
        .notEmpty()
        .withMessage("Name must be a string"),
    body("addressLine1")
        .isString()
        .notEmpty()
        .withMessage("Address line 1 must be a string"),
    body("country")
        .isString()
        .notEmpty()
        .withMessage("Country must be a string"),
    body("city")
        .isString()
        .notEmpty()
        .withMessage("City must be a string"),
    handleValidationErrors
]


export const validateMyRestaurantRequest = [
    body("restaurantName")
        .isString()
        .notEmpty()
        .withMessage("Restaurant name is required"),
    body("city")
        .isString()
        .notEmpty()
        .withMessage("City is required"),
    body("country")
        .isString()
        .notEmpty()
        .withMessage("Country is required"),
    body("deliveryPrice")
        .isFloat({ min: 0})
        .notEmpty()
        .withMessage("Delivery price is required and must be a positive number"),
    body("estimatedDeliveryTime")
        .isInt({ min: 0 })
        .notEmpty()
        .withMessage("Estimated delivery time is required and must be a positive number"),
    body("cuisines")
        .isArray()
        .notEmpty()
        .withMessage("Cuisines are required and must be an array"),
    body("menuItems")
        .isArray()
        .notEmpty()
        .withMessage("Menu items are required"),
    body("menuItems.*.name")
        .isString()
        .notEmpty()
        .withMessage("Menu item name is required"),
    body("menuItems.*.price")
        .isFloat({ min: 0 })
        .notEmpty()
        .withMessage("Menu item price is required and must be a positive number"),
    handleValidationErrors
]