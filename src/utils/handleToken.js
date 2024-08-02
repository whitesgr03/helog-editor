import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_URL}/auth/token`;

const createToken = async ({ code_verifier, code }) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			code_verifier,
			code,
		}),
	};

	return await handleFetch(url, options);
};
const verifyToken = async token => {
	const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return await handleFetch(url, options);
};
const exChangeToken = async token => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return await handleFetch(`${url}/refresh`, options);
};

export { createToken, verifyToken, exChangeToken };
