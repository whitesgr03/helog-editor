import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/user`;

export const getUser = async ({ signal }) => {
	const options = {
		method: 'GET',
		signal,
		headers: {
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
	};

	return await handleFetch(url, options);
};

export const updateUser = async fields => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': Cookies.get(
				import.meta.env.PROD ? '__Secure-token' : 'token',
			),
		},
		credentials: 'include',
		body: JSON.stringify(fields),
	};
	return await handleFetch(url, options);
};

export const getUserPostList = async ({ signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${url}/posts`, options);
};
