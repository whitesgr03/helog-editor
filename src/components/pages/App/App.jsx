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

// Context
import { AppDataProvider } from './AppDataProvider';

export const App = () => {
	const [darkTheme, setDarkTheme] = useState(null);

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
		<AppDataProvider>
			<div
				className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
				data-testid="app"
			>
				{isError && error.cause.status !== 404 ? (
					<Error onReGetUser={refetch} />
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
							<main>{!user ? <Login /> : <Outlet context={darkTheme} />}</main>
							<Footer />
						</div>
					</>
				)}
			</div>
		</AppDataProvider>
	);
};
