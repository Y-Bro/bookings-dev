import {
	BadRequestError,
	DatabaseConnectionError,
	requireAuth,
	validateRequest
} from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import * as validator from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
	"/api/tickets",
	[
		validator.body("title").not().isEmpty().withMessage("Title is required"),
		validator
			.body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greated than 0")
	],
	validateRequest,
	requireAuth,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const userId = req.currentUser!.id;

		const existingTicketRegexp = new RegExp(`^${title}$`, "i");

		const existingTicket = await Ticket.find({ title: existingTicketRegexp });

		if (existingTicket.length) {
			throw new BadRequestError("Ticket with the given name already exists");
		}

		const newTicket = Ticket.buildTicket({ price, title, userId });

		await newTicket.save();

		await new TicketCreatedPublisher(natsWrapper.client).publish({
			id: newTicket.id,
			price: newTicket.price,
			title: newTicket.title,
			userId: newTicket.userId,
			version: newTicket.version
		});

		res.status(201).send(newTicket);
	}
);

export { router as createTicketRouter };
