// Styles
import style from "./Footer.module.css";
import { container } from "../../pages/App/Contact.module.css";
import image from "../../../styles/image.module.css";

// Components
import Address from "./Address";

const Footer = () => {
	return (
		<footer className={style.footer}>
			<div className={container}>
				<a href="#git" alt="github" className={style.link}>
					<span className={`${image.icon} ${style.github}`} />
				</a>
				<div className={style.address}>
					<Address />
				</div>
			</div>
			<p>&copy; 2024 Designed &amp; coded by Weiss Bai</p>
		</footer>
	);
};

export default Footer;
