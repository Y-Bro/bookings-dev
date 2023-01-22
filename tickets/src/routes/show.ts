import { NotFoundError } from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
	let id = req.params.id;

	let ticket = await Ticket.findById({ _id: id });

	if (!ticket) {
		throw new NotFoundError();
	}

	res.status(200).send(ticket);
});

export { router as showTicketRouter };
