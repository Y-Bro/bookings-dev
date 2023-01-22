import { OrderCreatedEvent, OrderStatus } from "@ybro-bookings-dev/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Orders } from "../../../models/orders";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
	const listen = new OrderCreatedListener(natsWrapper.client);

	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		version: 0,
		userId: "abcd",
		expiresAt: "abcd",
		ticket: {
			id: "asdas",
			price: 10
		}
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listen, data, msg };
};

it("replicates the order info", async () => {
	const { listen, data, msg } = await setup();

	await listen.onMessage(data, msg);

	const order = await Orders.findById(data.id);

	expect(order?.price).toEqual(data.ticket.price);
});

it("it acks the message", async () => {
	const { listen, data, msg } = await setup();

	await listen.onMessage(data, msg);

	msg.ack();

	expect(msg.ack).toHaveBeenCalled();
});
