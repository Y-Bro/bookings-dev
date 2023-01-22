import mongoose from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdateListener } from "./events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("No JWT_KEY");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error("NATS_CLIENT_ID must be defined");
	}
	if (!process.env.NATS_URL) {
		throw new Error("NATS_URL must be defined");
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error("NATS_CLUSTER_ID must be defined");
	}

	mongoose.set("strictQuery", false);
	await natsWrapper.connect(
		process.env.NATS_CLUSTER_ID,
		process.env.NATS_CLIENT_ID,
		process.env.NATS_URL
	);
	natsWrapper.client.on("close", async () => {
		console.log("Shutting NATS down");
		process.exit();
	});

	process.on("SIGINT", () => natsWrapper.client.close());
	process.on("SIGTERM", () => natsWrapper.client.close());

	new TicketCreatedListener(natsWrapper.client).listen();
	new TicketUpdateListener(natsWrapper.client).listen();
	new ExpirationCompleteListener(natsWrapper.client).listen();
	new PaymentCreatedListener(natsWrapper.client).listen();

	await mongoose.connect(process.env.MONGO_URI);
	console.log("Connected to MongoDB");

	app.listen(3000, () => {
		console.log("Orders Service is running on PORT 3000");
	});
};

start();
