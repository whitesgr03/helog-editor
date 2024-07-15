// Packages
import { useEffect, useState } from "react";
import {
	useSearchParams,
	Navigate,
	useOutletContext,
	useNavigate,
} from "react-router-dom";

// Components
import Loading from "./layout/Loading";

// Utils
import handleFetch from "../utils/handleFetch";
import { getUser } from "../utils/handleUser";

const Callback = () => {
	const { setError, setUser, setRefreshToken, setAccessToken } =
		useOutletContext();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const lastPath = sessionStorage.getItem("heLog.lastPath") ?? "..";

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const queries = {
			state: searchParams.get("state"),
			code: searchParams.get("code"),
		};

		const storages = {
			state: sessionStorage.getItem("state"),
			codeVerifier: sessionStorage.getItem("code_verifier"),
		};

		const handleError = message => {
			setError(message);
			navigate("/error");
		};

		const handleGetToken = async () => {
			const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/auth/token`;
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code_verifier: storages.codeVerifier,
					code: queries.code,
				}),
				signal,
			};

			const tokenResult = await handleFetch(url, options);

			const handleGetUser = async () => {
				const { access_token, refresh_token } = tokenResult.data;

				setAccessToken(access_token);
				setRefreshToken(refresh_token);

				const result = await getUser(access_token);

				sessionStorage.removeItem("code_verifier");
				sessionStorage.removeItem("state");

				result.success
					? setUser(result.data)
					: setError(result.message);

				setLoading(false);
			};

			const handleResult = async () =>
				tokenResult.success
					? await handleGetUser()
					: handleError(tokenResult.message);

			tokenResult && (await handleResult());
		};

		const handleCheckState = () => {
			queries.state === storages.state
				? handleGetToken()
				: handleError("The state authentication failed.");
		};

		queries.state && queries.code && storages.state && storages.codeVerifier
			? handleCheckState()
			: handleError("The parameter is missing.");

		return () => controller.abort();
	}, [
		searchParams,
		setError,
		setUser,
		setRefreshToken,
		setAccessToken,
		navigate,
	]);
	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<Navigate
					to={lastPath === "/error" ? ".." : lastPath}
					replace={true}
				/>
			)}
		</>
	);
};

export default Callback;
