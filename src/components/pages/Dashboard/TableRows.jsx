// Packages
import { useOutletContext, Link } from 'react-router-dom';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Styles
import styles from './TableRows.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { DeletePostModel } from './DeletePostModel';

export const TableRows = ({ post, onDeletePost }) => {
	const { onActiveModal, onAlert } = useOutletContext();

	return (
		<tr className={styles['tbody-rows']}>
			<td title={post.title}>{post.title}</td>
			<td>
				<span
					data-testid="publish-icon"
					className={`${imageStyles.icon} ${post.publish ? styles.publish : styles.unpublish}`}
				/>
			</td>
			<td>
				<span>{format(post.updatedAt, 'MMMM d, y')}</span>
			</td>
			<td className={styles['button-wrap']}>
				<Link to={`/posts/${post._id}/editor`} className={styles.link}>
					<span className={`${imageStyles.icon} ${styles.edit}`} />
				</Link>
			</td>
			<td className={styles['button-wrap']}>
				<button
					data-testid="delete-button"
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
