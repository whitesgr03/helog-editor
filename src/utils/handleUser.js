import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/user`;

export const getUserInfo = async ({ signal }) => {
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

export const getUserPosts = async ({ pageParam: skip, signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${url}/posts?skip=${skip}`, options);
};
