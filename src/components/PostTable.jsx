// Packages
import { useState } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";

// Styles
import style from "../styles/PostTable.module.css";
import image from "../styles/utils/image.module.css";

const PostTable = ({ post }) => {
	const [publish, setPublish] = useState(false);

	const handleSwitchPublish = () => setPublish(!publish);
	return (
		<tr className={style.postTable}>
			<td title={post.title}>
				<span>{post.title}</span>
			</td>
			<td>
				<button
					className={`${style.switch} ${publish ? style.active : ""}`}
					onClick={handleSwitchPublish}
				>
					<div>
						<div />
					</div>
				</button>
			</td>
			<td>
				<span>{format(post.lastModified, "MMMM d, y")}</span>
			</td>
			<td className={style.buttonWrap}>
				<button
				// onClick={handleShowEditBox}
				>
					<span className={`${image.icon} ${style.edit}`} />
				</button>
			</td>
			<td className={style.buttonWrap}>
				<button
				// onClick={handleDelete}
				>
					<span className={`${image.icon} ${style.delete}`} />
				</button>
			</td>
		</tr>
	);
};

PostTable.propTypes = {
	post: PropTypes.object,
};

export default PostTable;
