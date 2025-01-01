// Packages
import { useState } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './DeletePostModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

import { deletePost } from '../../../utils/handlePost';

export const DeletePostModel = ({ id, title }) => {
	const { onActiveModal, onAlert, onPosts } = useOutletContext();
	const [loading, setLoading] = useState(false);

	const { pathname: previousPath } = useLocation();
	const navigate = useNavigate();

	const handleDeletePost = async () => {
		setLoading(true);

		const result = await deletePost({
			postId: id,
		});

		const handleSuccess = () => {
			onPosts(result.data);
			onAlert({ message: `Deleted ${title} successfully`, error: false });
			onActiveModal({ component: null });
		};

		result.success
			? await handleSuccess()
			: navigate('/dashboard/error', {
					state: { error: result.message, previousPath },
				});

		setLoading(false);
	};

	return (
		<div className={styles['delete-model']}>
			<span className={styles.title}>Delete Post</span>
			<div className={styles.content}>
				<p>Do you really want to delete?</p>
				<p>{title}</p>
			</div>
			<div className={styles['button-wrap']}>
				<button
					className={buttonStyles.cancel}
					data-close-model
					onClick={() => onActiveModal({ component: null })}
				>
					Cancel
				</button>
				<button
					className={buttonStyles.error}
					onClick={() => !loading && handleDeletePost()}
				>
					{loading && <span className={buttonStyles['load-icon']} />}
					Delete
				</button>
			</div>
		</div>
	);
};

DeletePostModel.propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
};
