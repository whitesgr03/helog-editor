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

	useEffect(() => {
		sessionStorage.setItem('heLog.lastPath', location.pathname);
	}, [location]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className={styles.app} data-testid="app">
					{model && <Model onModel={setModel} model={model} />}
					<div className={styles['header-bar']}>
						<Header
							user={user}
							darkTheme={darkTheme}
							onSwitchColorTheme={onColorTheme}
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
