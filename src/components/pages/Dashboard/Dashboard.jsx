// Package
import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

// Styles
import styles from './Dashboard.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Component
import { TableRows } from '../../TableRows';
import { Loading } from '../../utils/Loading';
import { Error } from '../../utils/Error/Error';

// Utils
import { getPosts } from '../../../utils/handlePost';

export const Dashboard = () => {
	const { accessToken, onVerifyTokenExpire, onExChangeToken } =
		useOutletContext();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [publishing, setPublishing] = useState(false);


	const trs = posts.map(post => (
		<TableRows
			key={post._id}
			post={post}
			publishing={publishing}
			onPublishing={setPublishing}
		/>
	));

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPosts = async () => {
			const result = await getPosts({ signal });

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
		<div className={styles.dashboard}>
			<h2>Dashboard</h2>
			<div className={styles['button-wrap']}>
				<span>{posts.length > 0 && `Total posts: ${posts.length}`}</span>
				<Link to="/post/editor" className={buttonStyles.success}>
					New Post
				</Link>
			</div>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={error} />
			) : (
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
							<tbody>{trs}</tbody>
						</table>
					) : (
						<p>There are not posts.</p>
					)}
				</div>
			)}
		</div>
	);
};
