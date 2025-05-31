// Packages
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Styles
import styles from './Header.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Dropdown } from './Dropdown';

// Utils
import { queryUserInfoOption } from '../../../utils/queryOptions';

// Type
import { DarkTheme } from '../../pages/App/App';

interface HeaderProps {
	darkTheme: DarkTheme;
	onColorTheme: () => void;
}

export interface User {
	email: string;
	username: string;
	isAdmin: boolean;
}

export const Header = ({ darkTheme, onColorTheme }: HeaderProps) => {
	const [activeDropdown, setActiveDropdown] = useState(false);

	const { data: user } = useQuery({ ...queryUserInfoOption(), enabled: false });

	const handleActiveDropdown = () => setActiveDropdown(!activeDropdown);
	const handleCloseDropdown = () => setActiveDropdown(false);

	return (
		<header className={styles.header}>
			<Link to="/posts" className={styles.logo}>
				<h1>HeLog</h1>
			</Link>
			<nav>
				<ul className={styles.list}>
					<li>
						<a href={`${import.meta.env.VITE_HELOG_URL}?theme=${darkTheme}`}>
							<span className={`${imageStyles.icon} ${styles.blog}`} />
							Blog
						</a>
					</li>
					<li className={styles['toggle-btn']}>
						<button onClick={onColorTheme}>
							<div className={buttonStyles.theme}>
								<span
									data-testid="theme-icon"
									className={`${imageStyles.icon} ${
										darkTheme ? styles.moon : styles.sun
									}`}
								/>
								<div>
									<div />
								</div>
							</div>
							<span>{darkTheme ? 'Dark' : 'Light'} mode</span>
						</button>
					</li>
					{user && (
						<li>
							<button onClick={handleActiveDropdown}>
								<span className={`${imageStyles.icon} ${styles.account}`} />
								Account
							</button>
						</li>
					)}
				</ul>
			</nav>
			{activeDropdown && (
				<>
					<Dropdown
						darkTheme={darkTheme}
						onColorTheme={onColorTheme}
						onCloseDropdown={handleCloseDropdown}
					/>
					<div
						className={styles['transparent-background']}
						onClick={handleCloseDropdown}
						data-testid="transparentBgc"
					/>
				</>
			)}
		</header>
	);
};
