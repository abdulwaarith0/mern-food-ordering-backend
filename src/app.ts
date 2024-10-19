import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { NODE_ENV } from "./constants";
import { Request, Response } from "express";
import { myUserRoute } from "./routes";


const app: Application = express();

const corsOptions = {
    origin: 'http://localhost:5173'
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.get("/test", async(req: Request, res: Response) => {
    res.json({ message: "Hello!" });
});
app.use("/api/my/user", myUserRoute);


export default app;