// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './Header.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Dropdown } from './Dropdown';

export const Header = ({ user, darkTheme, onColorTheme }) => {
	const [activeDropdown, setActiveDropdown] = useState(false);

	const handleActiveDropdown = () => setActiveDropdown(!activeDropdown);
	const handleCloseDropdown = () => setActiveDropdown(false);

	return (
		<>
			<header className={styles.header}>
				<a
					className={styles.logo}
					href={`${import.meta.env.VITE_HELOG_URL}?theme=${darkTheme}`}
				>
					<h1>HeLog</h1>
				</a>
				<nav>
					<ul className={styles.list}>
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
						<li>
							<button onClick={handleActiveDropdown}>
								<span className={`${imageStyles.icon} ${styles.account}`} />
								Account
							</button>
						</li>
					</ul>
				</nav>
				{activeDropdown && (
					<>
						<Dropdown
							user={user}
							darkTheme={darkTheme}
							onColorTheme={onColorTheme}
						/>
						<div
							className={styles['transparent-background']}
							onClick={handleCloseDropdown}
							data-testid="transparentBgc"
						/>
					</>
				)}
			</header>
		</>
	);
};
Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	onColorTheme: PropTypes.func,
};
