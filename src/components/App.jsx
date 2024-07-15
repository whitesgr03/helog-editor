// Packages
import { useState, useEffect } from "react";
import {
	Outlet,
	useOutletContext,
	useLocation,
	useNavigate,
} from "react-router-dom";

// Styles
import style from "../styles/App.module.css";

// Components
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Contact from "./layout/Contact";
import Loading from "./layout/Loading";

// Utils
import handleGetAuthCode from "../utils/handleGetAuthCode";
import handleFetch from "../utils/handleFetch";

const App = () => {
	const {
		user,
		setUser,
		error,
		setError,
		refreshToken,
		accessToken,
		setAccessToken,
		darkTheme,
		handleSwitchColorTheme,
	} = useOutletContext();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	const handleVerifyTokenExpire = async () => {
		const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/auth/token`;

		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};

		const result = await handleFetch(url, options);

		const handleError = message => {
			setError(message);
			navigate("/error");
		};

		return !result.success
			? result.message === "The token provided is expired."
				? true
				: handleError(result.message)
			: false;
	};
	const handleExChangeToken = async () => {
		const url = `${
			import.meta.env.VITE_RESOURCE_ORIGIN
		}/auth/token/refresh`;

		const options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		};

		const result = await handleFetch(url, options);

		const handleLogout = message => {
			const errorMessage =
				message === "Too many token exchange requests.";

			errorMessage && localStorage.removeItem("heLog.login-exp");
			errorMessage && setUser(null);

			setError(message);
			navigate("/error");
		};

		result.success
			? setAccessToken(result.data.access_token)
			: handleLogout(result.message);
	};

	useEffect(() => {
		sessionStorage.setItem("heLog.lastPath", location.pathname);
	}, [location]);
	useEffect(() => {
		user ? setLoading(false) : handleGetAuthCode();
	}, [user]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className={style.app} data-testid="app">
					<Header
						user={user}
						darkTheme={darkTheme}
						handleSwitchColorTheme={handleSwitchColorTheme}
					/>
					<div className={style.container}>
						<main>
							<Outlet
								context={{
									user,
									error,
									setError,
									accessToken,
									refreshToken,
									handleVerifyTokenExpire,
									handleExChangeToken,
								}}
							/>
						</main>
						<Contact />
						<Footer />
					</div>
				</div>
			)}
		</>
	);
};

export default App;
