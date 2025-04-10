// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './DeletePostModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deletePost } from '../../../utils/handlePost';

// Components
import { Loading } from '../../utils/Loading';

export const DeletePostModel = ({
	id,
	title,
	onActiveModal,
	onAlert,
	onDeletePost,
}) => {
	const [loading, setLoading] = useState(false);

	const handleDeletePost = async () => {
		setLoading(true);

		const result = await deletePost({
			postId: id,
		});

		const handleSuccess = () => {
			onDeletePost(id);
			onAlert({ message: `Post has been Deleted`, error: false, delay: 2000 });
		};

		result.success
			? handleSuccess()
			: onAlert({
					message: 'There are some errors occur, please try again later.',
					error: true,
					delay: 3000,
				});

		onActiveModal({ component: null });

		setLoading(false);
	};

	return (
		<>
			{loading && <Loading text={'Deleting...'} light={true} shadow={true} />}
			<div className={styles['delete-model']}>
				<span className={styles.title}>Delete Post</span>
				<div className={styles.content}>
					<p>Do you really want to delete?</p>
					<p className={styles['post-title']} title={title}>
						{title}
					</p>
				</div>
				<div className={styles['button-wrap']}>
					<button
						className={`${buttonStyles.content} ${buttonStyles.cancel}`}
						data-close-model
						onClick={() => onActiveModal({ component: null })}
					>
						Cancel
					</button>
					<button
						className={`${buttonStyles.content} ${buttonStyles.error}`}
						onClick={() => !loading && handleDeletePost()}
					>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

DeletePostModel.propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
	onActiveModal: PropTypes.func,
	onAlert: PropTypes.func,
	onDeletePost: PropTypes.func,
};
