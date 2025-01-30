// Packages
import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Styles
import styles from './TableRows.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { DeletePostModel } from './DeletePostModel';

export const TableRows = ({
	post,
	changing,
	onChanging,
	onUpdatePost,
	onDeletePost,
}) => {
	const { onActiveModal, onAlert } = useOutletContext();
	const [loading, setLoading] = useState(false);

	return (
		<tr className={styles['tbody-rows']}>
			<td>{post.title}</td>
			<td>
				<span
					className={`${imageStyles.icon} ${post.publish ? styles.publish : styles.unpublish}`}
				/>
			</td>
			<td>
				<span>{format(post.updatedAt, 'MMMM d, y')}</span>
			</td>
			<td className={styles['button-wrap']}>
				<Link to={`/editor/post/${post._id}`} className={styles.link}>
					<span className={`${imageStyles.icon} ${styles.edit}`} />
				</Link>
			</td>
			<td className={styles['button-wrap']}>
				<button
					className={styles['delete-button']}
					onClick={() =>
						onActiveModal({
							component: (
								<DeletePostModel
									id={post._id}
									title={post.title}
									onActiveModal={onActiveModal}
									onAlert={onAlert}
									onDeletePost={onDeletePost}
								/>
							),
						})
					}
				>
					<span className={`${imageStyles.icon} ${styles.delete}`} />
				</button>
			</td>
		</tr>
	);
};

TableRows.propTypes = {
	post: PropTypes.object,
	changing: PropTypes.bool,
	onChanging: PropTypes.func,
	onUpdatePost: PropTypes.func,
	onDeletePost: PropTypes.func,
};
