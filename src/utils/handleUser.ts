import { QueryFunctionContext } from '@tanstack/react-query';
import { handleFetch } from './handleFetch';
import Cookies from 'js-cookie';

const url = `${import.meta.env.VITE_RESOURCE_URL}/user`;

export const getUserInfo = async ({ signal }: QueryFunctionContext) => {
	const options: RequestInit = {
		method: 'GET',
		signal,
		headers: {
			'X-CSRF-TOKEN':
				Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ?? '',
		},
		credentials: 'include',
	};

	return await handleFetch(url, options);
};

export const getUserPosts = async ({
	pageParam: skip,
	signal,
}: QueryFunctionContext) => {
	const options: RequestInit = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${url}/posts?skip=${skip}`, options);
};

export const getUserPost = async ({
	queryKey,
	signal,
}: QueryFunctionContext) => {
	const [, postId] = queryKey;

	const options: RequestInit = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(`${url}/posts/${postId}`, options);
};
