// Packages
import { useOutletContext, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Error.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Error = ({ message = null }) => {
	const { error } = useOutletContext();

	const errorMessage =
		(typeof message === 'string' && message) ||
		'Please come back later or if you have any questions, please contact us.';

	console.error(message || error);

	return (
		<div className={styles.error}>
			<span className={`${imageStyles.icon} ${styles.alert}`} />
			<div className={styles.message}>
				<p>Our apologies, there has been an error.</p>
				<p>{errorMessage}</p>
			</div>
			<Link to="/" className={styles.link}>
				Back to Home Page.
			</Link>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
