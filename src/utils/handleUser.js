import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/user`;

export const getUser = async ({ signal }) => {
	const options = {
		method: 'GET',
		signal,
		credentials: 'include',
	};

	return await handleFetch(url, options);
};
