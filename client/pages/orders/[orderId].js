import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequestHook from "../../hooks/use-request";

const ShowOrder = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);

	const { doRequest, errors } = useRequestHook({
		url: "/api/payments",
		method: "post",
		body: {
			orderId: order.id
		},
		onSuccess: () => Router.push("/orders")
	});

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = Math.round(
				(new Date(order.expiresAt) - new Date()) / 1000
			);

			setTimeLeft(msLeft);
		};

		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return (
			<div>
				<h4>Order Expired</h4>
			</div>
		);
	}

	return (
		<div>
			<h4>Time left to purchase the ticket: {timeLeft} seconds</h4>
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey="pk_test_51MSQDcGfEn6iCG9Yf4jRrgzMtjXJF4CJUkyzcUPnWAelSSu3eW277ZxhPg4vBQZxqStPDoHPa0ViukNoTGJPb1vv00GrD62agT"
				amount={order.ticket.price * 100}
				email={currentUser.email}
			/>
		</div>
	);
};

ShowOrder.getInitialProps = async (ctx, client) => {
	const { orderId } = ctx.query;
	const { data } = await client.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default ShowOrder;
