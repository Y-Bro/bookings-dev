import {
	Listener,
	OrderCreatedEvent,
	Subjects
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = "tickets-service";

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) {
			throw new Error("Ticket Not Found");
		}

		ticket.orderId = data.id;

		await ticket.save();

		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId
		});

		msg.ack();
	}
}
