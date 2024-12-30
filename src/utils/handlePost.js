import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getPosts = async ({ token }) => {
	const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(url, options);
};

export const getPost = async ({ postId }) => {
	const options = {
		method: "GET",
	};
	const result = await handleFetch(`${url}/${postId}`, options);

	return result;
};

export const createPost = async ({ token, data }) => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	return await handleFetch(url, options);
};

export const updatePost = async ({ token, data, postId }) => {
	const options = {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${postId}`, options);
};

export const deletePost = async ({ token, postId }) => {
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(`${url}/${postId}`, options);
};
