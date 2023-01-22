import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth
} from "@ybro-bookings-dev/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		let { orderId } = req.params;

		let order = await Order.findById(orderId).populate("ticket");

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		res.send(order);
	}
);

export { router as showOrderRouters };
