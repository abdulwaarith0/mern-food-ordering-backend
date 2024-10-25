import { Router } from "express";
import { Restaurant } from "../../models";
import { param } from "express-validator";
import { searchRestaurant } from "../../controllers";

const router = Router();

// get all restaurants
// /api/restaurant/search/:city
router.get("/search/:city", param("city").
    isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
    searchRestaurant,
);

export default router;