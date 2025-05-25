// Packages
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import styles from './TableRows.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { DeletePostModel } from './DeletePostModel';

// Context
import { useAppDataAPI } from '../App/AppContext';

// Type
import { Post } from './Dashboard';

interface TableRowsProps {
	index: number;
	post: Post;
}

export const TableRows = ({ index, post }: TableRowsProps) => {
	const { onModal } = useAppDataAPI();

	return (
		<tr className={styles['tbody-rows']}>
			<td
				title={post.title}
			>{`${index + 1}. ${post.title === '' ? '( Empty )' : post.title}`}</td>
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
						onModal({
							component: (
								<DeletePostModel postId={post._id} title={post.title} />
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
