import {
	BadRequestError,
	DatabaseConnectionError,
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest
} from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import * as validator from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
	"/api/tickets/:id",
	[
		validator.body("title").not().isEmpty().withMessage("Title is required"),
		validator
			.body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greated than 0")
	],
	validateRequest,
	async (req: Request, res: Response) => {
		let ticketId = req.params.id;

		let ticket = await Ticket.findById({ _id: ticketId });

		if (!ticket) {
			throw new NotFoundError();
		}

		if (ticket.orderId) {
			throw new BadRequestError("Cannot edit a reserved ticket");
		}

		let userId = ticket.userId;

		if (req.currentUser!.id != userId) {
			console.log(req.currentUser?.id, userId);
			throw new NotAuthorizedError();
		}

		ticket.set({
			title: req.body.title,
			price: req.body.price
		});

		try {
			await ticket.save();

			await new TicketUpdatedPublisher(natsWrapper.client).publish({
				title: ticket.title,
				price: ticket.price,
				userId: ticket.userId,
				id: ticket.id,
				version: ticket.version
			});
		} catch (error) {
			throw new DatabaseConnectionError();
		}

		res.status(201).send(ticket);
	}
);

export { router as updateTicketRouter };
