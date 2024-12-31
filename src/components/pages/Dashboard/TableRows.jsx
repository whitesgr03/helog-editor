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
import { updatePost, deletePost } from '../utils/handlePost';

export const TableRows = ({ post, onGetPosts, publishing, onPublishing }) => {
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
		const handleUpdate = async () => {
			onPublishing(true);
			setLoading(true);

			const isTokenExpire = await onVerifyTokenExpire();
			const newAccessToken = isTokenExpire && (await onExChangeToken());

			const result = await updatePost({
				token: newAccessToken || accessToken,
				data: { publish: !post.publish },
				postId: post._id,
			});

			const handleSuccess = async () => {
				await onGetPosts();
				onAlert({
					message: `${!post.publish ? 'Published' : 'Unpublished'} ${
						post.title
					} `,
					error: false,
				});
			};

			result.success
				? await handleSuccess()
				: onAlert({ message: result.message, error: true });

			setLoading(false);
			onPublishing(false);
		};

		!publishing && (await handleUpdate());
	};

	const handleActiveModel = () => {
		const handleDelete = async () => {
			const isTokenExpire = await onVerifyTokenExpire();
			const newAccessToken = isTokenExpire && (await onExChangeToken());

			const result = await deletePost({
				token: newAccessToken || accessToken,
				postId: post._id,
			});

			const handleSuccess = async () => {
				await onGetPosts();
				onAlert({ message: `Deleted ${post.title}`, error: false });
			};

			result.success
				? await handleSuccess()
				: onAlert({ message: result.message, error: true });

			onModel(null);
		};

		onModel(<DeletePostModel onDelete={handleDelete} title={post.title} />);
	};

	return (
		<tr className={`${styles['table-rows']} ${loading ? styles.loading : ''}`}>
			<td title={post.title}>{post.title}</td>
			<td>
				<button
					className={`${styles.switch} ${post.publish ? styles.active : ''}`}
					onClick={handleUpdatePublish}
				>
					<div>
						<div />
					</div>
				</button>
			</td>
			<td>
				<span>{format(post.lastModified, 'MMMM d, y')}</span>
			</td>
			<td className={styles['button-wrap']}>
				<Link to="/post/editor" state={postState}>
					<span className={`${imageStyles.icon} ${styles.edit}`} />
				</Link>
			</td>
			<td className={styles['button-wrap']}>
				<button onClick={handleActiveModel}>
					<span className={`${imageStyles.icon} ${styles.delete}`} />
				</button>
			</td>
			{loading && (
				<td className={styles.loadIcon}>
					<span className={`${imageStyles.icon} ${styles.load}`} />
				</td>
			)}
		</tr>
	);
};

TableRows.propTypes = {
	post: PropTypes.object,
	onGetPosts: PropTypes.func,
	publishing: PropTypes.bool,
	onPublishing: PropTypes.func,
};
