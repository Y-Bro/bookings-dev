import { NotFoundError } from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
	let tickets = await Ticket.find({ orderId: undefined });

	if (!tickets) {
		throw new NotFoundError();
	}

	res.status(200).send(tickets);
});

export { router as showAllTicketsRouter };
