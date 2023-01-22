import {
	OrderCancelledEvent,
	Publisher,
	Subjects
} from "@ybro-bookings-dev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
