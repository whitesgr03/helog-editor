// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Dropdown.module.css';
import buttonStyles from '../../../styles/button.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Dropdown = ({ user, darkTheme, onSwitchColorTheme }) => {
	return (
		<div className={styles.dropdown}>
			{user?.name && (
				<>
					<div className={styles.profile}>
						<div className={styles.avatar}>
							{user.name.charAt(0).toUpperCase()}
						</div>
						<span title={user.name}>{user.name}</span>
					</div>
					<p>Welcome to HeLog Editor</p>
				</>
			)}
			<ul>
				<li>
					<button className={buttonStyles.theme} onClick={onSwitchColorTheme}>
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
	onSwitchColorTheme: PropTypes.func,
};
