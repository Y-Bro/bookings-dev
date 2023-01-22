const OrderIndex = ({ orders }) => {
	const orderList = orders.map((order, index) => {
		return (
			<tr key={order.id}>
				<td>{index}</td>
				<td>{order.ticket.title}</td>
				<td>{order.ticket.price}</td>
				<td>{order.status}</td>
			</tr>
		);
	});

	return (
		<div className="table-responsive">
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Title</th>
						<th scope="col">Price</th>
						<th scope="col">Status</th>
					</tr>
				</thead>
				<tbody>{orderList}</tbody>
			</table>
		</div>
	);
};

OrderIndex.getInitialProps = async (ctx, client) => {
	const { data } = await client.get("/api/orders");

	return { orders: data };
};

export default OrderIndex;
