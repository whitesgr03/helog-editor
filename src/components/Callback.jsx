// Packages
import { useEffect, useState, useRef } from "react";
import {
	useSearchParams,
	Navigate,
	useOutletContext,
	useNavigate,
} from "react-router-dom";

// Components
import { Loading } from "./utils/Loading";

// Utils
import { createToken } from "../utils/handleToken";

const Callback = () => {
	const { onError, onRefreshToken, onAccessToken } = useOutletContext();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const lastPath = sessionStorage.getItem("heLog.lastPath") ?? "..";
	const ignore = useRef(false);

	useEffect(() => {
		const queries = {
			state: searchParams.get("state"),
			code: searchParams.get("code"),
		};
		const storages = {
			state: sessionStorage.getItem("state"),
			codeVerifier: sessionStorage.getItem("code_verifier"),
		};
		const handleError = message => {
			onError(message);
			navigate("/error");
		};
		const handleCreateToken = async () => {
			const result = await createToken({
				code_verifier: storages.codeVerifier,
				code: queries.code,
			});

			const handleSuccess = async () => {
				const { session, access_token, refresh_token } = result.data;

				sessionStorage.removeItem("code_verifier");
				sessionStorage.removeItem("state");

				localStorage.setItem(
					"heLog.login-exp",
					JSON.stringify(new Date(session.exp).getTime())
				);

				onAccessToken(access_token);
				onRefreshToken(refresh_token);
			};

			result.success
				? await handleSuccess()
				: handleError(result.message);

			setLoading(false);
		};
		const handleCheckState = () => {
			queries.state === storages.state
				? handleCreateToken()
				: handleError("The state authentication failed.");
		};
		const handleCheckParameters = () => {
			ignore.current = true;
			queries.state &&
			queries.code &&
			storages.state &&
			storages.codeVerifier
				? handleCheckState()
				: handleError("The parameter is missing.");
		};

		!ignore.current && handleCheckParameters();
	}, [searchParams, onError, onRefreshToken, onAccessToken, navigate]);
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
