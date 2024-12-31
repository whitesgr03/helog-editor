// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Modal.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Modal = ({ onActiveModal, clickToClose, children }) => {
	return (
		<div
			className={styles.modal}
			onClick={e => {
				clickToClose &&
					e.target === e.currentTarget &&
					onActiveModal({ component: null });
			}}
			data-testid="modal"
		>
			<div className={styles['modal-wrap']}>
				{clickToClose && (
					<button
						className={styles['modal-button']}
						title="close-button"
						onClick={e =>
							e.target === e.currentTarget && onActiveModal({ component: null })
						}
					>
						<span className={`${imageStyles.icon} ${styles.close}`} />
					</button>
				)}
				<div className={styles.container}>{children}</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onActiveModal: PropTypes.func,
	clickToClose: PropTypes.bool,
	children: PropTypes.node,
};
