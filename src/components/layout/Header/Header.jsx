// Packages
import { useState } from "react";
import PropTypes from "prop-types";

// Styles
import styles from "./Header.module.css";
import dropdownStyles from "./Dropdown.module.css";
import buttonStyles from "../../../styles/button.module.css";
import imageStyles from "../../../styles/image.module.css";
import bgcStyles from "../../../styles/bgc.module.css";

// Components
import Dropdown from "./Dropdown";

export const Header = ({ user, darkTheme, onSwitchColorTheme }) => {
	const [activeDropdown, setActiveDropdown] = useState(false);

	const handleActiveDropdown = () => setActiveDropdown(!activeDropdown);
	const handleCloseDropdown = () => setActiveDropdown(false);

	return (
		<>
			<header className={styles.header}>
				<a
					className={styles.logo}
					href={`${
						import.meta.env.VITE_HELOG_URL
					}?darkTheme=${darkTheme}`}
					onClick={handleCloseDropdown}
				>
					<h1>HeLog</h1>
				</a>
				<nav>
					<ul className={styles.list}>
						<li className={styles.toggleBtn}>
							<button onClick={onSwitchColorTheme}>
								<div className={buttonStyles.theme}>
									<span
										data-testid={"icon"}
										className={`${imageStyles.icon} ${
											darkTheme
												? dropdownStyles.moon
												: dropdownStyles.sun
										}`}
									/>
									<div>
										<div />
									</div>
								</div>
								<span>{darkTheme ? "Dark" : "Light"} mode</span>
							</button>
						</li>
						<li>
							<button onClick={handleActiveDropdown}>
								<span
									className={`${imageStyles.icon} ${styles.account}`}
								/>
								Account
							</button>
						</li>
					</ul>
				</nav>
				{activeDropdown && (
					<Dropdown
						user={user}
						darkTheme={darkTheme}
						onSwitchColorTheme={onSwitchColorTheme}
					/>
				)}
			</header>
			{activeDropdown && (
				<div
					className={bgcStyles.transparentWindow}
					onClick={handleCloseDropdown}
					data-testid="transparentBgc"
				/>
			)}
		</>
	);
};
Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	onSwitchColorTheme: PropTypes.func,
};
