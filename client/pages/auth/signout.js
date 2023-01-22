import Router from "next/router";
import { useEffect } from "react";
import useRequestHook from "../../hooks/use-request";

const SignOut = () => {
	const { doRequest } = useRequestHook({
		url: "/api/users/signout",
		method: "post",
		body: {},
		onSuccess: () => Router.push("/")
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signing You Out</div>;
};

export default SignOut;
