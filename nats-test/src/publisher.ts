import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("bookings", "abc", {
	url: "http://localhost:4222"
});

stan.on("connect", async () => {
	console.log("Publisher conected to NATS");

	const data = {
		title: "abc",
		price: 25,
		id: "a"
	};

	try {
		await new TicketCreatedPublisher(stan).publish(data);
	} catch (error) {
		console.log(error);
	}
});
