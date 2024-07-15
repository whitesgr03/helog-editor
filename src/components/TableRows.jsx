// Packages
import { useState } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";

// Styles
import style from "../styles/TableRows.module.css";
import image from "../styles/utils/image.module.css";

const TableRows = ({ post }) => {
	const [publish, setPublish] = useState(false);

	const handleSwitchPublish = () => setPublish(!publish);
	return (
		<tr className={style.tableRows}>
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

TableRows.propTypes = {
	post: PropTypes.object,
};

export default TableRows;
