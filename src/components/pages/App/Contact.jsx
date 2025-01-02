// Styles
import styles from './Contact.module.css';

// Components
import { Address } from '../../layout/Footer/Address';

export const Contact = () => {
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
