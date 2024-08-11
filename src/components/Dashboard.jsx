// Package
import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";

// Styles
import style from "../styles/Dashboard.module.css";
import button from "../styles/utils/button.module.css";

// Component
import TableRows from "./TableRows";
import Loading from "./layout/Loading";
import Error from "./layout/Error";

// Utils
import { getPosts } from "../utils/handlePost";

const Dashboard = () => {
	const { accessToken, onVerifyTokenExpire, onExChangeToken } =
		useOutletContext();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [publishing, setPublishing] = useState(false);
	const ignore = useRef(false);

	const handleGetPosts = useCallback(async () => {
		ignore.current = true;
		const isTokenExpire = await onVerifyTokenExpire();
		const newAccessToken = isTokenExpire && (await onExChangeToken());

		const result = await getPosts({
			token: newAccessToken || accessToken,
		});

		const handleResult = () => {
			result.success ? setPosts(result.data) : setError(result.message);
			setLoading(false);
		};

		result && handleResult();
	}, [accessToken, onVerifyTokenExpire, onExChangeToken]);

	const trs = posts.map(post => (
		<TableRows
			key={post._id}
			post={post}
			publishing={publishing}
			onGetPosts={handleGetPosts}
			onPublishing={setPublishing}
		/>
	));

	useEffect(() => {
		!ignore.current && handleGetPosts();
	}, [handleGetPosts]);

	return (
		<div className={style.dashboard}>
			<h2>Dashboard</h2>
			<div className={style.buttonWrap}>
				<span>
					{posts.length > 0 && `Total posts: ${posts.length}`}
				</span>
				<Link to="/post/editor" className={button.success}>
					New Post
				</Link>
			</div>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={error} />
			) : (
				<div className={style.container}>
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

export default Dashboard;
