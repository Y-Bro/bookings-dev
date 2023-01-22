import {
	Listener,
	Subjects,
	TicketCreatedEvent
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
	queueGroupName = "orders-service";

	async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		const { id, price, title } = data;

		const ticket = Ticket.build({ id, price, title });

		await ticket.save();

		msg.ack();
	}
}
