// Packages
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';
import loadingStyles from '../../utils/Loading.module.css';

// Utils
import { handleFetch } from '../../../utils/handleFetch.js';

// Variables
const URL = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

export const Dropdown = ({
	user,
	darkTheme,
	onColorTheme,
	onCloseDropdown,
}) => {
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { isPending, mutate } = useMutation({
		mutationFn: async () => {
			const options = {
				method: 'POST',
				headers: {
					'X-CSRF-TOKEN':
						Cookies.get(import.meta.env.PROD ? '__Secure-token' : 'token') ??
						'',
				},
				credentials: 'include',
			};
			return await handleFetch(URL, options);
		},
		onError: () => {
			navigate('/error', { state: { previousPath } });
			onCloseDropdown();
		},
		onSuccess: () =>
			location.assign(`${import.meta.env.VITE_HELOG_URL}?theme=${darkTheme}`),
	});

	const handleLogout = () => mutate();

	return (
		<div className={styles.dropdown}>
			{user?.username && (
				<div className={styles.profile}>
					<div className={styles.avatar}>
						{user.username.charAt(0).toUpperCase()}
					</div>
					<span title={user.username}>{user.username}</span>
				</div>
			)}
			<p>Welcome to HeLog Editor</p>
			<ul>
				<li>
					<button className={buttonStyles.theme} onClick={onColorTheme}>
						<span
							className={`${imageStyles.icon} ${
								darkTheme ? styles.moon : styles.sun
							}`}
							data-testid="theme-icon"
						/>
						{darkTheme ? 'Dark' : 'Light'} mode
						<div>
							<div />
						</div>
					</button>
				</li>
				<li>
					<button onClick={handleLogout}>
						<span
							data-testid="loading-icon"
							className={`${imageStyles.icon} ${isPending ? loadingStyles.load : styles.logout}`}
						/>
						Logout
					</button>
				</li>
			</ul>
		</div>
	);
};

Dropdown.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	onColorTheme: PropTypes.func,
	onCloseDropdown: PropTypes.func,
};
