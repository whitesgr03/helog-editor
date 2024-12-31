export const handleFetch = async (url, option) => {
	try {
		const response = await fetch(url, { ...option });
		const result = await response.json();
		response.status !== 200 && (result.status = response.status);
		return result;
	} catch (err) {
		return (
			!option.signal.aborted && {
				success: false,
				message: err,
			}
		);
	}
};
