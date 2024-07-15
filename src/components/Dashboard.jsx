// Package
import { Link } from "react-router-dom";

// Styles
import style from "../styles/Dashboard.module.css";
import button from "../styles/utils/button.module.css";

// Component
import TableRows from "./TableRows";

const Dashboard = () => {
	const posts = [
		{
			_id: 0,
			title: "This is title",
			publish: false,
			lastModified: new Date(),
			createdAt: new Date(),
		},
		{
			_id: 1,
			title: "This is title2",
			publish: true,
			lastModified: new Date(),
			createdAt: new Date(),
		},
		{
			_id: 2,
			title: "This is title2",
			publish: true,
			lastModified: new Date(),
			createdAt: new Date(),
		},
		{
			_id: 3,
			title: "This is title2",
			publish: true,
			lastModified: new Date(),
			createdAt: new Date(),
		},
		{
			_id: 4,
			title: "This is title2",
			publish: true,
			lastModified: new Date(),
			createdAt: new Date(),
		},
	];

	const trs = posts.map(post => {
		return <TableRows key={post._id} post={post} />;
	});
	return (
		<div className={style.dashboard}>
			<h3>Posts Dashboard</h3>
			<div className={style.buttonWrap}>
				<span>
					{posts.length > 0 && `Total posts: ${posts.length}`}
				</span>
				<Link to="/posts/create" className={button.success}>
					New Post
				</Link>
			</div>

			<div className={style.container}>
				{posts.length > 0 ? (
					<table>
						<tr>
							<th>Title</th>
							<th>Publish</th>
							<th>Last Modified</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
						{trs}
					</table>
				) : (
					<p>There are not posts.</p>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
