import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const createPost = async ({ data }) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};

	return await handleFetch(url, options);
};

export const updatePost = async ({ data, postId }) => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${postId}`, options);
};

export const deletePost = async postId => {
	const options = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
	};

	return await handleFetch(`${url}/${postId}`, options);
};
