// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';
import loadingStyles from '../../utils/Loading.module.css';

// Utils
import { handleFetch } from '../../../utils/handleFetch.js';

export const Dropdown = ({ user, darkTheme, onColorTheme }) => {
	const [loading, setLoading] = useState(null);

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const handleLogout = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

		const options = {
			method: 'POST',
			headers: {
				'X-CSRF-TOKEN': Cookies.get('token'),
			},
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		result.success
			? location.assign(`${import.meta.env.VITE_HELOG_URL}?theme=${darkTheme}`)
			: navigate('/error', {
					state: { error: result.message, previousPath },
				});

		setLoading(false);
	};

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
						{loading ? (
							<span className={`${imageStyles.icon} ${loadingStyles.load}`} />
						) : (
							<span
								className={`${imageStyles.icon} ${styles.logout}`}
								data-testid="loading-icon"
							/>
						)}
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
};
