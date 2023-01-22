import { OrderStatus } from "@ybro-bookings-dev/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./order";

interface TicketAttrs {
	price: number;
	title: string;
	id: string;
}

export interface TicketDoc extends mongoose.Document {
	price: number;
	title: string;
	version: number;
	isReserved(): Promise<Boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
	findByEvent(event: {
		id: string;
		version: number;
	}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},

		price: {
			type: Number,
			required: true,
			min: 0
		}
	},
	{
		toJSON: {
			transform(doc, ret, options) {
				ret.id = ret._id;
				delete ret._id;
			}
		}
	}
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	console.log(event.id, event.version, "here");
	return Ticket.findOne({
		_id: event.id,
		version: event.version - 1
	});
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket({
		_id: attrs.id,
		price: attrs.price,
		title: attrs.title
	});
};

ticketSchema.methods.isReserved = async function () {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
				OrderStatus.Created
			]
		}
	});

	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
