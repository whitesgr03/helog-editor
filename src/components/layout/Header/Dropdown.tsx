// Packages
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useMutation, useQuery } from '@tanstack/react-query';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';
import loadingStyles from '../../utils/Loading.module.css';

// Utils
import { handleFetch } from '../../../utils/handleFetch.ts';
import { queryUserInfoOption } from '../../../utils/queryOptions';

// Variables
const URL = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

// Type
import { DarkTheme } from '../../pages/App/App.js';

interface DropdownProps {
	darkTheme: DarkTheme;
	onColorTheme: () => void;
	onCloseDropdown: () => void;
}

export const Dropdown = ({
	darkTheme,
	onColorTheme,
	onCloseDropdown,
}: DropdownProps) => {
	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { data: user } = useQuery({ ...queryUserInfoOption(), enabled: false });

	const { isPending, mutate } = useMutation({
		mutationFn: async () => {
			const options: RequestInit = {
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
