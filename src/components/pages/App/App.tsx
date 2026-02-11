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
import { Offline } from '../../utils/Error/Offline';

// Utils
import { queryUserInfoOption } from '../../../utils/queryOptions';

// Context
import { AppProvider } from './AppContext';

export type DarkTheme = boolean | null;

export const App = () => {
	const [darkTheme, setDarkTheme] = useState<DarkTheme>(null);
	const [isOnline, setIsOnline] = useState(true);
	const [searchParams] = useSearchParams();

	const { isPending, isError, error, refetch } = useQuery(
		queryUserInfoOption(),
	);

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
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

	useEffect(() => {
		window.addEventListener('offline', () => {
			setIsOnline(false);
		});
		window.addEventListener('online', () => {
			setIsOnline(true);
		});
	}, []);

	useEffect(() => {
		if (isError && error.cause.status === 401) {
			window.location.assign(
				`${import.meta.env.VITE_HELOG_ACCOUNT_URL}/sign-in`,
			);
		}
	}, [isError]);

	return (
		<AppProvider>
			<div
				className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
				data-testid="app"
			>
				{isError ? (
					error.cause.status === 401 ? (
						<div className={styles.loading}>
							<Loading text={'Redirecting to login page ...'} />
						</div>
					) : (
						<Error onReGetUser={refetch} />
					)
				) : isPending ? (
					<div className={styles.loading}>
						<Loading text={'Loading data ...'} />
					</div>
				) : (
					<>
						<Modal />
						<div className={styles['header-bar']}>
							<Header darkTheme={darkTheme} onColorTheme={handleColorTheme} />
							<Alert />
						</div>
						<div className={styles.container}>
							{isOnline ? (
								<main>
									<Outlet context={darkTheme} />
								</main>
							) : (
								<Offline />
							)}
							<Footer />
						</div>
					</>
				)}
			</div>
		</AppProvider>
	);
};
