// Packages
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Error.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Error = ({ onReGetUser }) => {
	const { state } = useLocation();

	return (
		<div className={styles.error}>
			<span className={`${imageStyles.icon} ${styles.alert}`} />
			<div className={styles.message}>
				<p>Our apologies, there has been an error.</p>
				{state?.customMessage ? (
					<p>{state?.error}</p>
				) : (
					<p>
						Please come back later, or if you have any questions, contact us.
					</p>
				)}
			</div>
			{state?.previousPath && (
				<Link to={state.previousPath} className={styles.link}>
					Go Back
				</Link>
			)}

			<Link
				to="/"
				className={styles.link}
				onClick={() => onReGetUser && onReGetUser(true)}
			>
				Back to Home Page
			</Link>
		</div>
	);
};

Error.propTypes = {
	onReGetUser: PropTypes.func,
};
