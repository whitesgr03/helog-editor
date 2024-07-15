// Packages
import { useState } from "react";
import { Outlet } from "react-router-dom";

// Styles
import style from "../styles/UserProvider.module.css";

// Utils
import handleColorScheme from "../utils/handleColorScheme";

const UserProvider = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [accessToken, setAccessToken] = useState(null);

	const [darkTheme, setDarkTheme] = useState(
		JSON.parse(localStorage.getItem("heLog.darkTheme")) ?? handleColorScheme
	);

	const handleSwitchColorTheme = () => {
		localStorage.setItem("heLog.darkTheme", JSON.stringify(!darkTheme));
		setDarkTheme(!darkTheme);
	};

	return (
		<div
			className={` ${darkTheme ? "dark" : ""} ${style.user_provider}`}
			data-testid="user_provider"
		>
			<Outlet
				context={{
					user,
					setUser,
					error,
					setError,
					refreshToken,
					setRefreshToken,
					accessToken,
					setAccessToken,
					darkTheme,
					handleSwitchColorTheme,
				}}
			/>
		</div>
	);
};

export default UserProvider;
