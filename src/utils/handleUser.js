import { handleFetch } from './handleFetch';

const url = `${import.meta.env.VITE_RESOURCE_URL}/blog/user`;

export const getUser = async token => {
	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return await handleFetch(url, options);
};
