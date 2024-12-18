import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import {
    NODE_ENV,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} from "./constants";
import { Request, Response } from "express";
import { myRestaurantRoute, myUserRoute, orderRoute, restaurantRoute } from "./routes";
import { v2 as cloudinary } from "cloudinary";


const app: Application = express();

const corsOptions = {
    origin: "http://localhost:5173",
    // origin: "https://lucid-food-ordering.onrender.com",
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

app.use(cors(corsOptions));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Health Check OK!" });
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);


export default app;