import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/blog/user`;

const getUser = async token => {
	const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return await handleFetch(url, options);
};
const updateUser = async (token, fields) => {
	const options = {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(fields),
	};
	return await handleFetch(url, options);
};
const deleteUser = async token => {
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(url, options);
};

export { getUser, updateUser, deleteUser };
