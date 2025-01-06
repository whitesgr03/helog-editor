// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Dropdown = ({ user, darkTheme, onColorTheme }) => {
	return (
		<div className={styles.dropdown}>
			{user?.username ? (
				<>
					<div className={styles.profile}>
						<div className={styles.avatar}>
							{user.username.charAt(0).toUpperCase()}
						</div>
						<span title={user.username}>{user.username}</span>
					</div>
					<p>Welcome to HeLog Editor</p>
				</>
			) : (
				<p>Welcome to HeLog Editor</p>
			)}
			<ul>
				<li>
					<button className={buttonStyles.theme} onClick={onColorTheme}>
						<span
							className={`${imageStyles.icon} ${
								darkTheme ? styles.moon : styles.sun
							}`}
						/>
						{darkTheme ? 'Dark' : 'Light'} mode
						<div>
							<div />
						</div>
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
