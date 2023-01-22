import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	Subjects,
	validateRequest
} from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("ticketId must be provided")
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		//check for reserved ticket

		const isReserved = await ticket.isReserved();

		if (isReserved) {
			throw new BadRequestError("Ticket not available");
		}

		const expirationDate = new Date();
		expirationDate.setMinutes(expirationDate.getMinutes() + 1);

		const newOrder = Order.build({
			expiresAt: expirationDate,
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			ticket
		});

		await newOrder.save();

		//publish

		new OrderCreatedPublisher(natsWrapper.client).publish({
			expiresAt: newOrder.expiresAt.toISOString(),
			id: newOrder.id,
			version: newOrder.version,
			status: OrderStatus.Created,
			userId: newOrder.userId,
			ticket: {
				id: ticket.id,
				price: ticket.price
			}
		});

		res.status(201).send(newOrder);
	}
);

export { router as newOrderRouter };
