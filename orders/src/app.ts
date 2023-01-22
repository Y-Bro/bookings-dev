import express from "express";
import "express-async-errors";
import {
	NotFoundError,
	errorHandler,
	currentUser
} from "@ybro-bookings-dev/common";
import cookieSession from "cookie-session";
import { showOrderRouters } from "./routes/show";
import { showAllOrdersRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";

const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test"
	})
);

app.use(currentUser);

app.use(showOrderRouters);
app.use(showAllOrdersRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);

app.get("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
