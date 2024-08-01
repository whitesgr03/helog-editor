// Packages
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Dropdown.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

const Dropdown = ({ user, darkTheme, onSwitchColorTheme }) => {
	return (
		<div className={style.dropdown}>
			{user?.name && (
				<div className={style.profile}>
					<div className={style.avatar}>
						{user.name.charAt(0).toUpperCase()}
					</div>
					<p>{user.name}</p>
					<p>Welcome to HeLog Editor</p>
				</div>
			)}
			<ul>
				<li>
					<button
						className={button.theme}
						onClick={onSwitchColorTheme}
					>
						<span
							className={`${image.icon} ${
								darkTheme ? style.moon : style.sun
							}`}
						/>
						{darkTheme ? "Dark" : "Light"} mode
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

export default Dropdown;
