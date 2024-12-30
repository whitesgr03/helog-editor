// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './DeletePostModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

export const DeletePostModel = ({ onDelete, title }) => {
	return (
		<div className={styles['delete-model']}>
			<span className={styles.title}>Delete Post</span>
			<div className={styles.content}>
				<p>Do you really want to delete?</p>
				<p>{title}</p>
			</div>
			<div className={styles['button-wrap']}>
				<button className={buttonStyles.cancel} data-close-model>
					Cancel
				</button>
				<button className={buttonStyles.error} onClick={onDelete}>
					Delete
				</button>
			</div>
		</div>
	);
};

DeletePostModel.propTypes = {
	title: PropTypes.string,
	onDelete: PropTypes.func,
};
