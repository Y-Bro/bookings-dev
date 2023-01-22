import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PayementAttrs {
	orderId: string;
	stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
	orderId: string;
	stripeId: string;
	version: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
	build(attrs: PayementAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			required: true
		},
		stripeId: {
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

paymentSchema.set("versionKey", "version");

paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PayementAttrs) => {
	return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
	"Payment",
	paymentSchema
);

export { Payment };
