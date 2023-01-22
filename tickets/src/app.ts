import express from "express";
import "express-async-errors";
import {
	NotFoundError,
	errorHandler,
	currentUser
} from "@ybro-bookings-dev/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { showAllTicketsRouter } from "./routes/show-all";
import { updateTicketRouter } from "./routes/update";

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showAllTicketsRouter);
app.use(updateTicketRouter);

app.get("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
