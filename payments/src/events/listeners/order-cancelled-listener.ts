import {
	Listener,
	OrderCancelledEvent,
	OrderStatus,
	Subjects
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = "payments-service";
	async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
		const order = await Orders.findOne({
			_id: data.id,
			version: data.version - 1
		});

		if (!order) {
			throw new Error("Order not found");
		}

		order.status = OrderStatus.Cancelled;

		await order.save();

		msg.ack();
	}
}
