export const handleFetch = async (url, options, validStatus) => {
	const response = await fetch(url, options).catch(error => {
		throw new Error('fetch error', { cause: error });
	});

	if (!response.ok && !validStatus?.find(status => response.status === status))
		throw new Error('response status error', { cause: response });

	return response.json();
};
