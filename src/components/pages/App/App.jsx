// Packages
import { useState, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Styles
import 'normalize.css';
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Loading } from '../../utils/Loading';
import { Alert } from './Alert';
import { Error } from '../../utils/Error/Error';
import { Modal } from './Modal';
import { Login } from '../Account/Login';

// Utils
import { queryUserInfoOption } from '../../../utils/queryOptions';

export const App = () => {
	const [darkTheme, setDarkTheme] = useState(null);
	const [modal, setModal] = useState(null);
	const [alert, setAlert] = useState([]);

	const [searchParams] = useSearchParams();

	const {
		isPending,
		isError,
		data: user,
		error,
		refetch,
	} = useQuery(queryUserInfoOption);

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error, delay, autosave }) => {
		const newAlert = {
			message,
			error,
			delay,
		};

		setAlert(
			alert.length < 2 && !autosave ? alert.concat(newAlert) : [newAlert],
		);
	};

	const handleActiveModal = ({ component, clickToClose = true }) => {
		document.body.removeAttribute('style');
		component && (document.body.style.overflow = 'hidden');
		component ? setModal({ component, clickToClose }) : setModal(null);
	};

	useEffect(() => {
		const getColorTheme = () => {
			const themeParams = searchParams.get('theme');
			const darkScheme = localStorage.getItem('darkTheme');
			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			const theme =
				themeParams !== null
					? themeParams
					: darkScheme !== null
						? darkScheme
						: String(browserDarkScheme);

			localStorage.setItem('darkTheme', theme);
			setDarkTheme(theme === 'true');
		};
		darkTheme === null && getColorTheme();
	}, [darkTheme, searchParams]);

	return (
		<>
			{error ? (
				<Error onReGetUser={refetch} />
			) : (
				<div
					className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
					data-testid="app"
				>
					{isError && error.cause.status !== 404 ? (
						<Error onReGetUser={refetch} />
					) : isPending ? (
						<div className={styles.loading}>
							<Loading text={'Loading ...'} />
						</div>
					) : (
						<>
							{modal && (
								<Modal
									onActiveModal={handleActiveModal}
									clickToClose={modal.clickToClose}
								>
									{modal.component}
								</Modal>
							)}
							<div className={styles['header-bar']}>
								<Header darkTheme={darkTheme} onColorTheme={handleColorTheme} />
								<Alert alert={alert} onAlert={setAlert} />
							</div>
							<div className={styles.container}>
								<main>
									{!user ? (
										<Login />
									) : (
										<Outlet
											context={{
												onActiveModal: handleActiveModal,
												onAlert: handleAlert,
											}}
										/>
									)}
								</main>
								<Footer />
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};
