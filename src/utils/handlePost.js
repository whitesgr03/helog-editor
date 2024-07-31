import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/blog/posts`;

const getPosts = async ({ signal, userId }) => {
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		signal,
	};
	return await handleFetch(`${url}?userId=${userId}`, options);
};
const getPost = async ({ postId }) => {
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};
	const result = await handleFetch(`${url}/${postId}`, options);

	return result;
};
const createPost = async ({ token, data }) => {
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
const updatePost = async ({ token, data, postId }) => {
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
const deletePost = async ({ token, postId }) => {
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return await handleFetch(`${url}/${postId}`, options);
};

export { getPosts, getPost, createPost, updatePost, deletePost };
