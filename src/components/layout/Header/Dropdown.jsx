// Packages
import PropTypes from "prop-types";

// Styles
import style from "./Dropdown.module.css";
import button from "../../../styles/button.module.css";
import image from "../../../styles/image.module.css";

const Dropdown = ({ user, darkTheme, onSwitchColorTheme }) => {
	return (
		<div className={style.dropdown}>
			{user?.name && (
				<>
					<div className={style.profile}>
						<div className={style.avatar}>
							{user.name.charAt(0).toUpperCase()}
						</div>
						<span title={user.name}>{user.name}</span>
					</div>
					<p>Welcome to HeLog Editor</p>
				</>
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
