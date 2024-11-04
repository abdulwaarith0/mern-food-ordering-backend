import { Router } from "express";
import { Restaurant } from "../../models";
import { param } from "express-validator";
import { searchRestaurant, getRestaurant } from "../../controllers";

const router = Router();

router.get("/:restaurantId",
    param("restaurantId").
        isString()
        .trim()
        .notEmpty()
        .withMessage("RestaurantId parameter must be a valid string"),
    getRestaurant,
);

// get all restaurants
// /api/restaurant/search/:city
router.get("/search/:city",
    param("city").
        isString()
        .trim()
        .notEmpty()
        .withMessage("City parameter must be a valid string"),
    searchRestaurant,
);

export default router;