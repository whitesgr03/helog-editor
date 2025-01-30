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

// Utils
import { updatePost } from '../../../utils/handlePost';

export const TableRows = ({
	post,
	changing,
	onChanging,
	onUpdatePost,
	onDeletePost,
}) => {
	const { onActiveModal, onAlert } = useOutletContext();
	const [loading, setLoading] = useState(false);

	const postState = {
		postId: post._id,
		publish: post.publish,
		data: {
			content: post.content ?? '',
			title: post.title ?? '',
			mainImage: post.mainImage ?? '',
		},
	};

	const handleUpdatePublish = async () => {
		onChanging(true);
		setLoading(true);

		const result = await updatePost({
			data: { publish: !post.publish },
			postId: post._id,
		});

		const handleSuccess = async () => {
			onUpdatePost(result.data);
			onAlert({
				message: `Post is ${result.data.publish ? 'Published' : 'Unpublished'}.`,
				error: false,
			});
		};

		result.success
			? await handleSuccess()
			: onAlert({
					message: 'There are some errors occur, please try again later.',
					error: true,
				});

		setLoading(false);
		onChanging(false);
	};

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
				<Link to="/post/editor">
					<span className={`${imageStyles.icon} ${styles.edit}`} />
				</Link>
			</td>
			<td className={styles['button-wrap']}>
				<button
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
			{loading && (
				<td className={styles['load-icon']}>
					<span className={`${imageStyles.icon} ${styles.load}`} />
				</td>
			)}
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
