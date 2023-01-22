import {
	ExpirationCompleteEvent,
	Publisher,
	Subjects
} from "@ybro-bookings-dev/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
