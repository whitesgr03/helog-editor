// Packages
import { useState, useEffect, useCallback } from "react";
import {
	Outlet,
	useOutletContext,
	useLocation,
	useNavigate,
} from "react-router-dom";

// Styles
import styles from "./App.module.css";

// Components
import { Header } from "../../layout/Header/Header";
import { Footer } from "../../layout/Footer/Footer";
import { Contact } from "./Contact";
import { Loading } from "../../utils/Loading";
import { Alert } from "./Alert";
import { Model } from "./Model";

// Utils
import handleGetAuthCode from "../../../utils/handleGetAuthCode";
import { verifyToken, exChangeToken } from "../../../utils/handleToken";
import { getUser } from "../../../utils/handleUser";

// Variables
const defaultAlert = {
	message: "",
	error: false,
};

export const App = () => {
	const {
		darkTheme,
		user,
		refreshToken,
		accessToken,
		onUser,
		onError,
		onAccessToken,
		onColorTheme,
		ignore,
	} = useOutletContext();

	const [model, setModel] = useState(null);
	const [alert, setAlert] = useState(defaultAlert);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const location = useLocation();

	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);

	const handleTokenExpire = useCallback(async () => {
		const result = await verifyToken(accessToken);

		const handleError = message => {
			const errorMessage =
				message === "The request requires higher privileges.";

			errorMessage && localStorage.removeItem("heLog.login-exp");
			errorMessage && onUser(null);
			onError(message);
			navigate("/error");
		};

		return !result.success
			? result.message === "The token provided is expired."
				? true
				: handleError(result.message)
			: false;
	}, [accessToken, navigate, onError, onUser]);
	const handleExChangeToken = useCallback(async () => {
		const result = await exChangeToken(refreshToken);

		const handleError = message => {
			const errorMessage =
				message === "The request requires higher privileges.";

			errorMessage && localStorage.removeItem("heLog.login-exp");
			errorMessage && onUser(null);

			onError(message);
			navigate("/error");
		};

		const handleSuccess = () => {
			onAccessToken(result.data.access_token);
			return result.data.access_token;
		};

		return result.success ? handleSuccess() : handleError(result.message);
	}, [onAccessToken, refreshToken, navigate, onError, onUser]);

	useEffect(() => {
		sessionStorage.setItem("heLog.lastPath", location.pathname);
	}, [location]);
	useEffect(() => {
		!refreshToken && handleGetAuthCode();
	}, [refreshToken]);
	useEffect(() => {
		const handleGetUserInfo = async () => {
			ignore.current = true;

			const isTokenExpire = await handleTokenExpire();
			const newAccessToken =
				isTokenExpire && (await handleExChangeToken());

			const result = await getUser(newAccessToken || accessToken);

			const handleResult = () => {
				result.success ? onUser(result.data) : onError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		user
			? setLoading(false)
			: !ignore.current && accessToken && handleGetUserInfo();
	}, [
		user,
		accessToken,
		ignore,
		onUser,
		onError,
		handleTokenExpire,
		handleExChangeToken,
	]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className={styles.app} data-testid="app">
					{model && <Model onModel={setModel} model={model} />}
					<div className={styles.headerBar}>
						<Header
							user={user}
							darkTheme={darkTheme}
							onSwitchColorTheme={onColorTheme}
						/>
						{alert.message !== "" && (
							<Alert
								onCloseAlert={handleCloseAlert}
								alert={alert}
							/>
						)}
					</div>
					<div className={styles.container}>
						<main>
							<Outlet
								context={{
									darkTheme,
									user,
									accessToken,
									onVerifyTokenExpire: handleTokenExpire,
									onExChangeToken: handleExChangeToken,
									onModel: setModel,
									onAlert: handleAlert,
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
