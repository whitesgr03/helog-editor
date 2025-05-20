// Packages
import { useMutation } from '@tanstack/react-query';

// Styles
import styles from './DeletePostModel.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Utils
import { deletePost } from '../../../utils/handlePost';
import { queryClient } from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';

// Context
import { useAppDataAPI } from '../App/AppContext';

// Type
import { PostData } from './Dashboard';

interface DeletePostModel {
	postId: string;
	title: string;
}

export const DeletePostModel = ({ postId, title }: DeletePostModel) => {
	const { onModal, onAlert } = useAppDataAPI();
	const { isPending, mutate } = useMutation({
		mutationFn: deletePost,
		onError: () =>
			onAlert([
				{
					message:
						'Delete the post has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]),
		onSuccess: () => {
			queryClient.setQueryData(['userPosts'], (data: PostData) => {
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
			onAlert([
				{
					message: 'Post has been deleted.',
					error: false,
					delay: 4000,
				},
			]);
		},
		onSettled: () => onModal({ component: null }),
	});

	const handleDeletePost = () => {
		onModal({
			component: <DeletePostModel postId={postId} title={title} />,
			clickBgToClose: false,
		});
		mutate(postId);
	};

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
						onClick={() => onModal({ component: null })}
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
