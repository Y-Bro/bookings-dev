import {
	Listener,
	OrderStatus,
	PaymentCreatedEvent,
	Subjects
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
	queueGroupName = "orders-service";
	async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
		let order = await Order.findById(data.orderId);

		console.log("order id in orders", data.orderId);

		if (!order) {
			throw new Error("Order not found");
		}

		order.status = OrderStatus.Complete;

		await order.save();

		msg.ack();
	}
}
