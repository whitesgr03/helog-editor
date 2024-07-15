// Styles
import style from "../styles/Dashboard.module.css";

// Variables
import imageUrl from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const Dashboard = () => {
	const posts = [
		{
			title: "This is title",
			publish: false,
			lastModified: new Date(),
			createdAt: new Date(),
		},
		{
			title: "This is title2",
			publish: true,
			lastModified: new Date(),
			createdAt: new Date(),
		},
	];

	const item = posts.map(post => {
		return (
			<li key={post._id}>
				<div>
					<img src={imageUrl} />
				</div>
				<div>{post.title}</div>
				<div>{post.publish}</div>
				<div>
					<button>Edit</button>
					<button>Delete</button>
				</div>
			</li>
		);
	});
	return (
		<div className={style.dashboard}>
			<h3>Post dashboard</h3>

			<ul>
				<li>
					<div>Image</div>
					<div>Title</div>
					<div>Publisher</div>
					<div></div>
				</li>
				{item}
			</ul>
		</div>
	);
};

export default Dashboard;
