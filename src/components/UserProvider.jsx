// Packages
import { useState, useEffect, useRef } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

// Styles
import style from "../styles/UserProvider.module.css";

// Utils
import handleColorScheme from "../utils/handleColorScheme";

const UserProvider = () => {
	const [searchParams] = useSearchParams();
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const ignore = useRef(false);

	const [darkTheme, setDarkTheme] = useState(
		JSON.parse(localStorage.getItem("heLog.darkTheme")) ?? handleColorScheme
	);

	const handleColorTheme = () => {
		localStorage.setItem("heLog.darkTheme", JSON.stringify(!darkTheme));
		setDarkTheme(!darkTheme);
	};

	useEffect(() => {
		const darkTheme = searchParams.get("darkTheme") === "true";
		darkTheme !== null &&
			localStorage.setItem("heLog.darkTheme", JSON.stringify(darkTheme));
	}, [searchParams]);

	return (
		<div
			className={`${darkTheme ? "dark" : ""} ${style.user_provider}`}
			data-testid="user_provider"
		>
			<Outlet
				context={{
					darkTheme,
					user,
					refreshToken,
					accessToken,
					error,
					ignore,
					onUser: setUser,
					onError: setError,
					onColorTheme: handleColorTheme,
					onAccessToken: setAccessToken,
					onRefreshToken: setRefreshToken,
				}}
			/>
		</div>
	);
};

export default UserProvider;
