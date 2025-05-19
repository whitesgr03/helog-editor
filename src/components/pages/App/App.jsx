// Packages
import { useState, useEffect } from 'react';
import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';
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
import { CreateUsername } from './CreateUsername';
import { Login } from '../Account/Login';

// Utils
import { queryUserInfoOption } from '../../../utils/queryOptions';

export const App = () => {
	const [darkTheme, setDarkTheme] = useState(null);
	const [modal, setModal] = useState(null);
	const [alert, setAlert] = useState([]);
	const [fetching, setFetching] = useState(true);
	const [reGetUser, setReGetUser] = useState(false);
	const [posts, setPosts] = useState([]);

	const navigate = useNavigate();
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

	const handleCreatePost = newPost => {
		setPosts([newPost, ...posts]);
	};

	const handleUpdatePost = newPost => {
		setPosts(posts.map(post => (post._id === newPost._id ? newPost : post)));
	};

	const handleDeletePost = id => {
		setPosts(posts.filter(post => post._id !== id));
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
	}, [navigate, darkTheme, searchParams]);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPosts = async () => {
			const result = await getUserPostList({ signal });

			const handleResult = () => {
				result.success
					? setPosts(result.data)
					: result.status !== 404 && setError(result.message);
				setFetching(false);
			};

			result && handleResult();
		};
		handleGetPosts();
		return () => controller.abort();
	}, []);

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
								<Header
									user={user}
									darkTheme={darkTheme}
									onColorTheme={handleColorTheme}
								/>
								<Alert alert={alert} onAlert={setAlert} />
							</div>
							<div className={styles.container}>
								<main>
									{!user ? (
										<Login />
									) : !user.username ? (
										!modal &&
										handleActiveModal({
											component: (
												<CreateUsername
													onActiveModal={handleActiveModal}
													onUser={setUser}
													onAlert={handleAlert}
													onError={setError}
												/>
											),
											clickToClose: false,
										})
									) : (
										<Outlet
											context={{
												user,
												posts,
												onUser: setUser,
												onActiveModal: handleActiveModal,
												onAlert: handleAlert,
												onCreatePost: handleCreatePost,
												onUpdatePost: handleUpdatePost,
												onDeletePost: handleDeletePost,
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
