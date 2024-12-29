// Styles
import styles from "./Contact.module.css";

// Components
import Address from "./Footer/Address";

const Contact = () => {
	return (
		<div className={styles.contact}>
			<h3>Contact</h3>
			<p>Please contact us, If you have any questions.</p>
			<div className={styles.container}>
				<Address />
			</div>
		</div>
	);
};

export default Contact;
