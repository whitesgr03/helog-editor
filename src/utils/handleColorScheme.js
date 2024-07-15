const handleColorScheme = () => {
	const darkTheme =
		window.matchMedia("(prefers-color-scheme: dark)")?.matches ?? false;

	localStorage.setItem("heLog.darkTheme", JSON.stringify(darkTheme));

	return darkTheme;
};
export default handleColorScheme;
