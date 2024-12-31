// Packages
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Contact } from './Contact';
import { Loading } from '../../utils/Loading';
import { Alert } from './Alert';
import { Error } from '../../utils/Error/Error';
import { Modal } from './Modal';

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
	const [modal, setModal] = useState(null);
	const [alert, setAlert] = useState(defaultAlert);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [reGetUser, setReGetUser] = useState(false);

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);

	const handleActiveModal = ({ component, clickToClose = true }) => {
		document.body.removeAttribute('style');
		component && (document.body.style.overflow = 'hidden');
		component ? setModal({ component, clickToClose }) : setModal(null);
	};

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
				reGetUser && setReGetUser(false);

				const handleSuccess = () => {
					error && setError(false);
					setUser(result.data);
				};

				result.success
					? handleSuccess()
					: result.status === 500 && setError(result.message);

				setLoading(false);
			};

			result && handleResult();
		};
		(reGetUser || !user) && handleGetUser();
		return () => controller.abort();
	}, [reGetUser, user, error]);

	return (
		<>
			{error ? (
				<Error onReGetUser={setReGetUser} />
			) : loading ? (
				<Loading />
			) : (
				<div className={`${darkTheme ? 'dark' : ''} ${styles.app}`}>
					{modal && (
						<Modal
							onActiveModal={handleActiveModal}
							clickToClose={modal.clickToClose}
						>
							{modal.component}
						</Modal>
					)}
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
									user,
									onUser: setUser,
									onActiveModal: handleActiveModal,
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
