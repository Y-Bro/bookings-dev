import { useState } from "react";
import useRequestHook from "../../hooks/use-request";
import Router from "next/router";

const signUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { doRequest, errors } = useRequestHook({
		url: "/api/users/signup",
		method: "post",
		body: {
			email,
			password
		},
		onSuccess: () => Router.push("/")
	});

	const onSubmit = async (event) => {
		event.preventDefault();

		await doRequest();
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign Up</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-control"
				></input>
			</div>
			<div className="form-group">
				<label>password</label>
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					className="form-control"
				></input>
			</div>
			{errors}
			<div>
				<button className="btn btn-dark">Submit</button>
			</div>
		</form>
	);
};

export default signUp;
