import {
	PaymentCreatedEvent,
	Publisher,
	Subjects
} from "@ybro-bookings-dev/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
