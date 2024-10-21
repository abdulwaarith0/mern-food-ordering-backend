import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { NODE_ENV } from "./constants";
import { Request, Response } from "express";
import { myUserRoute } from "./routes";


const app: Application = express();

const corsOptions = {
    origin: 'https://lucid-food-ordering.onrender.com'
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ message: "health check OK!" });
});
app.use("/api/my/user", myUserRoute);


export default app;