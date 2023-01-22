import {
	Listener,
	Subjects,
	TicketUpdateEvent
} from "@ybro-bookings-dev/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdateListener extends Listener<TicketUpdateEvent> {
	readonly subject = Subjects.TicketUpdate;
	queueGroupName = "orders-service";
	async onMessage(data: TicketUpdateEvent["data"], msg: Message) {
		const { id, price, title, version } = data;

		const ticket = await Ticket.findByEvent(data);

		if (!ticket) {
			throw new Error("Ticket not found");
		}

		ticket.price = price;
		ticket.title = title;

		await ticket.save();

		msg.ack();
	}
}
