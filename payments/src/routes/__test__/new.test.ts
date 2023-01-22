import { OrderStatus } from "@ybro-bookings-dev/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Orders } from "../../models/orders";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

it("throws 404 if order not found", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "abc",
			orderId: new mongoose.Types.ObjectId().toHexString()
		})
		.expect(404);
});

it("throws 401 if order does not belong to the user", async () => {
	const order = Orders.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0
	});

	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "abc",
			orderId: order.id
		})
		.expect(401);
});

it("throw 400 if purchasing a cancelled order", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = Orders.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
		status: OrderStatus.Cancelled,
		userId,
		version: 0
	});

	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "abc",
			orderId: order.id
		})
		.expect(400);
});

it("return a 201 with valid inputs", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = Orders.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
		status: OrderStatus.Created,
		userId,
		version: 0
	});

	await order.save();

	const resp = await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "tok_visa",
			orderId: order.id
		});

	console.log(resp);

	const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

	// expect(chargeOptions.source).toEqual("tok_visa");
	// expect(chargeOptions.amount).toEqual(10 * 100);

	const payment = await Payment.findOne({
		orderId: order.id
	});

	// expect(payment?.id).toEqual(order.id);
});
