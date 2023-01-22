import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}$</td>
				<td>
					<Link
						legacyBehavior
						href="/tickets/[ticketId]"
						as={`/tickets/${ticket.id}`}
					>
						<a>View</a>
					</Link>
				</td>
			</tr>
		);
	});

	console.log(ticketList);

	return (
		<div>
			<h1>Tickets</h1>
			<div className="table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th scope="col">Title</th>
							<th scope="col">Price</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>{ticketList}</tbody>
				</table>
			</div>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get("/api/tickets");
	return { tickets: data };
};

export default LandingPage;
