import "dotenv/config";
import app from "./app";
import { PORT } from "./constants";
import { connectMongoDB } from "./database";

const port = PORT || 7000;

app.listen(port, async () => {
	console.log(`Server listening on ${port}`);
	connectMongoDB();
});
