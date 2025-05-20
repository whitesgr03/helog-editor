import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/posts`;

export const createPost = async ({
	data,
}: {
	data: {
		title: string;
		mainImage: string;
		content: string;
	};
}) => {
	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};

	return await handleFetch(url, options);
};

export const updatePost = async ({
	postId,
	data,
}: {
	postId: string;
	data: {
		title: string;
		mainImage: string;
		content: string;
		publish: boolean;
	};
}) => {
	const options: RequestInit = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
		body: JSON.stringify(data),
	};
	return await handleFetch(`${url}/${postId}`, options);
};

export const deletePost = async (postId: string) => {
	const options: RequestInit = {
		method: 'DELETE',
		headers: {
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
	};

	return await handleFetch(`${url}/${postId}`, options);
};
