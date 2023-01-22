import Router from "next/router";
import { useState } from "react";
import useRequestHook from "../../hooks/use-request";

const NewPage = () => {
	const [price, setPrice] = useState("");
	const [title, setTitle] = useState("");

	const { doRequest, errors } = useRequestHook({
		url: "/api/tickets",
		method: "post",
		body: {
			title,
			price
		},
		onSuccess: () => Router.push("/")
	});

	const onBlurHandler = () => {
		console.log(price, title);

		const value = parseFloat(price);

		if (isNaN(value)) {
			return;
		}

		setPrice(value.toFixed(2));
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		await doRequest();
	};

	return (
		<div>
			<h1>Create a ticket</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="form-input-title">Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						type="text"
						className="form-control"
						id="form-input-price"
						placeholder="Enter title"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="form-input-price">Price</label>
					<input
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						onBlur={onBlurHandler}
						type="text"
						className="form-control"
						id="form-input-price"
						placeholder="Enter price"
					/>
				</div>
				{errors}
				<button className="btn btn-outline-dark" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default NewPage;
