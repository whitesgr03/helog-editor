// Packages
import { useState } from "react";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Header.module.css";
import { sun, moon } from "../../styles/layout/Dropdown.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";
import { transparentWindow } from "../../styles/utils/bgc.module.css";

const url = `${import.meta.env.VITE_HELOG_ORIGIN}`;

// Components
import Dropdown from "./Dropdown";

const Header = ({ user, darkTheme, handleSwitchColorTheme }) => {
	const [activeDropdown, setActiveDropdown] = useState(false);

	const handleActiveDropdown = () => setActiveDropdown(!activeDropdown);
	const handleCloseDropdown = () => setActiveDropdown(false);

	return (
		<>
			<header className={style.header}>
				<a
					className={style.logo}
					href={url}
					onClick={handleCloseDropdown}
				>
					<h1>HeLog</h1>
				</a>
				<nav>
					<ul className={style.list}>
						<li className={style.toggleBtn}>
							<button onClick={handleSwitchColorTheme}>
								<div className={button.theme}>
									<span
										data-testid={"icon"}
										className={`${image.icon} ${
											darkTheme ? moon : sun
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
									className={`${image.icon} ${style.account}`}
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
						handleSwitchColorTheme={handleSwitchColorTheme}
					/>
				)}
			</header>
			{activeDropdown && (
				<div
					className={transparentWindow}
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
	handleSwitchColorTheme: PropTypes.func,
};

export default Header;
