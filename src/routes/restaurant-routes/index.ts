import { Router } from "express";
import multer from "multer";
import { createMyRestaurant } from "../../controllers";
import { jwtCheck, jwtParse, validateMyRestaurantRequest } from "../../middleware";


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB
    },
})


// api/my/restaurant
router.post("/",
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    createMyRestaurant
);


export default router;