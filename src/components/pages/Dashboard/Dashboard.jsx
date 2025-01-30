// Package
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

// Styles
import styles from './Dashboard.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Component
import { TableRows } from './TableRows';

export const Dashboard = () => {
	const { posts, onUpdatePost, onDeletePost } = useOutletContext();

	const [changing, setChanging] = useState(false);

	return (
		<div className={styles.dashboard}>
			<h2>Dashboard</h2>
			<div className={styles['table-top']}>
				<span>{posts.length > 0 && `Total posts: ${posts.length}`}</span>
				<Link
					to="/editor/post"
					className={`${buttonStyles.content} ${buttonStyles.success} ${styles.link}`}
				>
					New Post
				</Link>
			</div>
			<div className={styles.container}>
				{posts.length > 0 ? (
					<table>
						<thead className={styles.thead}>
							<tr>
								<th>Title</th>
								<th>Publish</th>
								<th>Last Modified</th>
								<th>Edit</th>
								<th>Delete</th>
							</tr>
						</thead>
						<tbody>
							{posts.map(post => (
								<TableRows
									key={post.id}
									post={post}
									changing={changing}
									onChanging={setChanging}
									onUpdatePost={onUpdatePost}
									onDeletePost={onDeletePost}
								/>
							))}
						</tbody>
					</table>
				) : (
					<p>There are not posts.</p>
				)}
			</div>
		</div>
	);
};
