// Packages
import { useState, useEffect } from 'react';
import {
	Outlet,
	useOutletContext,
	useLocation,
	useNavigate,
} from 'react-router-dom';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Contact } from './Contact';
import { Loading } from '../../utils/Loading';
import { Alert } from './Alert';
import { Model } from './Model';

// Utils
import { getUser } from '../../../utils/handleUser';

// Variables
const defaultAlert = {
	message: '',
	error: false,
};

export const App = () => {
	const [darkTheme, setDarkTheme] = useState(false);
	const [user, setUser] = useState(null);
	const [model, setModel] = useState(null);
	const [alert, setAlert] = useState(defaultAlert);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const location = useLocation();

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);

	useEffect(() => {
		const getColorTheme = () => {
			const darkScheme = localStorage.getItem('darkTheme');

			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			darkScheme === null &&
				localStorage.setItem('darkTheme', browserDarkScheme);

			setDarkTheme(
				darkScheme === null ? browserDarkScheme : darkScheme === 'true',
			);
		};
		getColorTheme();
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetUser = async () => {
			const result = await getUser({ signal });

			const handleResult = () => {
				result.success && setUser(result.data);
				setLoading(false);
			};

			result && handleResult();
		};
		handleGetUser();
		return () => controller.abort();
	}, []);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className={`${darkTheme ? 'dark' : ''} ${styles.app}`}>
					{model && <Model onModel={setModel} model={model} />}
					<div className={styles['header-bar']}>
						<Header
							user={user}
							darkTheme={darkTheme}
							onColorTheme={handleColorTheme}
						/>
						{alert.message !== '' && (
							<Alert onCloseAlert={handleCloseAlert} alert={alert} />
						)}
					</div>
					<div className={styles.container}>
						<main>
							<Outlet
								context={{
									darkTheme,
									user,
									accessToken,
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
