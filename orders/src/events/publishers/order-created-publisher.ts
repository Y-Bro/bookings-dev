import {
	OrderCreatedEvent,
	Publisher,
	Subjects
} from "@ybro-bookings-dev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
