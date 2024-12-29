// Styles
import style from "../../styles/layout/Footer.module.css";
import { container } from "../../styles/layout/Contact.module.css";
import image from "../../styles/utils/image.module.css";

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
