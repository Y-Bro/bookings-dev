import mongoose, { mongo } from "mongoose";

import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ticketAttrs {
	title: string;
	price: number;
	userId: string;
}

//interface for model
interface TicketModel extends mongoose.Model<TicketDoc> {
	buildTicket(attrs: ticketAttrs): TicketDoc;
}

//interface for doc
interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	version: number;
	orderId?: string;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		userId: {
			type: String,
			required: true
		},
		orderId: {
			type: String
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

ticketSchema.statics.buildTicket = (attrs: ticketAttrs) => {
	return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
