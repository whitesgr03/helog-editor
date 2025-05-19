// Packages
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';

// Styles
import styles from './DeletePostModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deletePost } from '../../../utils/handlePost';
import { queryClient } from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';

export const DeletePostModel = ({ postId, title, onActiveModal, onAlert }) => {
	const { isPending, mutate } = useMutation({
		mutationFn: deletePost,
		onError: () =>
			onAlert({
				message:
					'Delete the post has some errors occur, please try again later.',
				error: true,
				delay: 4000,
			}),
		onSuccess: () => {
			queryClient.setQueryData(['userPosts'], data => {
				const newPages = data.pages.map(page => ({
					...page,
					data: {
						...page.data,
						userPosts: page.data.userPosts.filter(post => post._id !== postId),
					},
				}));
				return {
					pages: newPages,
					pageParams: data.pageParams,
				};
			});
			onAlert({
				message: 'Post has been deleted.',
				error: false,
				delay: 4000,
			});
		},
		onSettled: () => onActiveModal({ component: null }),
	});

	const handleDeletePost = () => mutate(postId);

	return (
		<>
			{isPending && (
				<Loading text={'Deleting ...'} light={true} shadow={true} />
			)}
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
						onClick={handleDeletePost}
					>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

DeletePostModel.propTypes = {
	postId: PropTypes.string,
	title: PropTypes.string,
	onActiveModal: PropTypes.func,
	onAlert: PropTypes.func,
	onDeletePost: PropTypes.func,
};
