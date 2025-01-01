import handleFetch from "./handleFetch";

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const getPosts = async ({ signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};
	return await handleFetch(url, options);
};

export const getPost = async ({ postId }) => {
	const options = {
		method: 'GET',
		credentials: 'include',
	};
	const result = await handleFetch(`${url}/${postId}`, options);

	return result;
};

export const createPost = async ({ data }) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};

	return await handleFetch(url, options);
};

export const updatePost = async ({ data, postId }) => {
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${postId}`, options);
};

export const deletePost = async ({ postId }) => {
	const options = {
		method: 'DELETE',
		credentials: 'include',
	};
	return await handleFetch(`${url}/${postId}`, options);
};
