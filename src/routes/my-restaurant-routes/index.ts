import { Router } from "express";
import multer from "multer";
import { createMyRestaurant, getMyRestaurant, updateMyRestaurant } from "../../controllers";
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

// Create a new restaurant
// POST:  api/my/restaurant
router.post("/",
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    createMyRestaurant
);

// Get current user's restaurant
// GET:  api/my/restaurant
router.get("/",
    jwtCheck,
    jwtParse,
    getMyRestaurant
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