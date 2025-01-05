// Packages
import { useState } from 'react';
import {
	useOutletContext,
	Link,
	useNavigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Styles
import styles from './TableRows.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { DeletePostModel } from './DeletePostModel';

// Utils
import { updatePost } from '../../../utils/handlePost';

export const TableRows = ({ post, publishing, onPublishing, onUpdatePost }) => {
	const { onActiveModal, onAlert } = useOutletContext();
	const { pathname: previousPath } = useLocation();
	const navigate = useNavigate();
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
			setLoading(true);
			onPublishing(true);

			const result = await updatePost({
				data: { publish: !post.publish },
				postId: post._id,
			});

			const handleSuccess = async () => {
				const { title, publish } = result.data;
				onUpdatePost(result.data);
				onAlert({
					message: `Post ${title} is ${publish ? 'Published' : 'Unpublished'}`,
					error: false,
				});
			};

			result.success
				? await handleSuccess()
				: navigate('/dashboard/error', {
						state: { error: result.message, previousPath },
					});

			onPublishing(false);
			setLoading(false);
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
				<span>{format(post.updatedAt, 'MMMM d, y')}</span>
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
				<td className={styles['load-icon']}>
					<span className={`${imageStyles.icon} ${styles.load}`} />
				</td>
			)}
		</tr>
	);
};

TableRows.propTypes = {
	post: PropTypes.object,
	publishing: PropTypes.bool,
	onPublishing: PropTypes.func,
	onUpdatePost: PropTypes.func,
};
