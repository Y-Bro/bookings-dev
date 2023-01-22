import {
	ExpirationCompleteEvent,
	Listener,
	OrderStatus,
	Subjects
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
	queueGroupName = "orders-service";
	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
		let orderId = data.orderId;

		const order = await Order.findById(orderId).populate("ticket");

		if (!order) {
			throw new Error("Order does not exist");
		}

		if (order.status === OrderStatus.Complete) {
			return msg.ack();
		}

		order.status = OrderStatus.Cancelled;

		await order.save();

		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id
			}
		});

		msg.ack();
	}
}
