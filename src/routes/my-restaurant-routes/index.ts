import { Router } from "express";
import multer from "multer";
import { createMyRestaurant, getMyRestaurant, updateMyRestaurant, getMyRestaurantOrders, updateOrderStatus } from "../../controllers";
import { jwtCheck, jwtParse, validateMyRestaurantRequest } from "../../middleware";


const router = Router();

// Multer configuration 
const storage = multer.memoryStorage();
// Multer middleware to handle image file upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB
    },
})

// Get current user's restaurant orders
// GET:  api/my/restaurant/orders
router.get("/orders",
    jwtCheck,
    jwtParse,
    getMyRestaurantOrders
);


// Update order status (for restaurant)
// PATCH:  api/my/restaurant/order/:orderId/status
router.patch("/order/:orderId/status",
    jwtCheck,
    jwtParse,
    updateOrderStatus
);


// Get current user's restaurant
// GET:  api/my/restaurant
router.get("/",
    jwtCheck,
    jwtParse,
    getMyRestaurant
);

// Create a new restaurant
// POST:  api/my/restaurant
router.post("/",
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    createMyRestaurant
);


// Update current user's restaurant
// PUT:  api/my/restaurant
router.put("/",
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    updateMyRestaurant
);

export default router;