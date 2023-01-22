import { OrderStatus } from "@ybro-bookings-dev/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
	id: string;
	status: OrderStatus;
	price: number;
	userId: string;
	version: number;
}

interface OrderDoc extends mongoose.Document {
	status: OrderStatus;
	price: number;
	userId: string;
	version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		status: {
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Orders({
		_id: attrs.id,
		status: attrs.status,
		price: attrs.price,
		userId: attrs.userId,
		version: attrs.version
	});
};

orderSchema.set("versionKey", "version");

orderSchema.plugin(updateIfCurrentPlugin);

const Orders = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Orders };
