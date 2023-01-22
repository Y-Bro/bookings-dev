import {
	Publisher,
	Subjects,
	TicketUpdateEvent
} from "@ybro-bookings-dev/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
	readonly subject = Subjects.TicketUpdate;
}
