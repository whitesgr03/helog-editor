// Package
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

// Styles
import styles from './Dashboard.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Component
import { TableRows } from './TableRows';
import { Loading } from '../../utils/Loading';

// Utils
import { getUserPostList } from '../../../utils/handleUser';

export const Dashboard = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [publishing, setPublishing] = useState(false);

	const { pathname: previousPath } = useLocation();

	const handleUpdatePost = newPost => {
		setPosts(posts.map(post => (post.id === newPost.id ? newPost : post)));
	};

	const handleDeletePost = id => {
		setPosts(posts.filter(post => post.id !== id));
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPosts = async () => {
			const result = await getUserPostList({ signal });

			const handleResult = () => {
				result.success ? setPosts(result.data) : setError(result.message);

				setLoading(false);
			};

			result && handleResult();
		};
		handleGetPosts();
		return () => controller.abort();
	}, []);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : loading ? (
				<Loading text={'Loading...'} />
			) : (
				<div className={styles.dashboard}>
					<h2>Dashboard</h2>
					<div className={styles['button-wrap']}>
						<span>{posts.length > 0 && `Total posts: ${posts.length}`}</span>
						<Link to="/post/editor" className={buttonStyles.success}>
							New Post
						</Link>
					</div>
					<div className={styles.container}>
						{posts.length > 0 ? (
							<table>
								<thead>
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
											key={post._id}
											post={post}
											publishing={publishing}
											onPublishing={setPublishing}
											onUpdatePost={handleUpdatePost}
											onDeletePost={handleDeletePost}
										/>
									))}
								</tbody>
							</table>
						) : (
							<p>There are not posts.</p>
						)}
					</div>
				</div>
			)}
		</>
	);
};
