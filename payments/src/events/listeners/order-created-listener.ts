import {
	Listener,
	OrderCreatedEvent,
	Subjects
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = "payments-service";
	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const order = Orders.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version
		});

		await order.save();

		msg.ack();
	}
}
