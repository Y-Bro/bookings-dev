import Router from "next/router";
import useRequestHook from "../../hooks/use-request";

const TicketShow = ({ ticket, currentUser }) => {
	const { doRequest, errors } = useRequestHook({
		url: "/api/orders",
		method: "post",
		body: {
			ticketId: ticket.id
		},
		onSuccess: (resp) => Router.push("/orders/[orderId]", `/orders/${resp.id}`)
	});

	return (
		<div>
			<h1>{ticket.title}</h1>
			<h4>Price: {ticket.price}</h4>
			<button
				onClick={() => doRequest()}
				className="btn btn-outline-secondary"
				type="button"
			>
				Buy
			</button>
			{errors}
		</div>
	);
};

TicketShow.getInitialProps = async (context, client) => {
	const { ticketId } = context.query;

	const { data } = await client.get(`/api/tickets/${ticketId}`);

	return { ticket: data };
};

export default TicketShow;
