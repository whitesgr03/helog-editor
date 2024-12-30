// Styles
import styles from "./Footer.module.css";
import contactStyles from "../../pages/App/Contact.module.css";
import imageStyles from "../../../styles/image.module.css";

// Components
import { Address } from "./Address";

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={contactStyles.container}>
				<a href="#git" alt="github" className={styles.link}>
					<span className={`${imageStyles.icon} ${styles.github}`} />
				</a>
				<div className={styles.address}>
					<Address />
				</div>
			</div>
			<p>&copy; 2024 Designed &amp; coded by Weiss Bai</p>
		</footer>
	);
};
