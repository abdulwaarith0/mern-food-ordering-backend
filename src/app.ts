import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { NODE_ENV, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "./constants";
import { Request, Response } from "express";
import { myUserRoute } from "./routes";
import { v2 as cloudinary } from "cloudinary";


const app: Application = express();

const corsOptions = {
    origin: 'https://lucid-food-ordering.onrender.com'
};

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

app.use(express.json());
app.use(cors(corsOptions));

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ message: "health check OK!" });
});
app.use("/api/my/user", myUserRoute);


export default app;