import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest
} from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Orders } from "../models/orders";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
	"/api/payments",
	requireAuth,
	[body("token").not().isEmpty(), body("orderId").not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Orders.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId != req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		if (order.status == OrderStatus.Cancelled) {
			throw new BadRequestError("Ticket expired");
		}

		const charge = await stripe.charges.create({
			currency: "usd",
			amount: order.price * 100,
			source: token
		});

		// await stripe.paymentIntents.create({
		// 	currency: "inr",
		// 	amount: order.price * 100,
		// 	payment_method: token
		// });

		const payment = Payment.build({
			orderId: orderId,
			stripeId: charge.id
		});

		await payment.save();

		new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: charge.id
		});

		res
			.status(201)
			.send({ id: payment.id, amt: charge.amount, orderId: payment.orderId });
	}
);

export { router as createChargeRouter };
