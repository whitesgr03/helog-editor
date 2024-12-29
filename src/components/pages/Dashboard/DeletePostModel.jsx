// Packages
import PropTypes from "prop-types";

// Styles
import style from "./DeletePostModel.module.css";
import button from "../../../styles/button.module.css";

const DeletePostModel = ({ onDelete, title }) => {
	return (
		<div className={style.deleteModel}>
			<span className={style.title}>Delete Post</span>
			<div className={style.content}>
				<p>Do you really want to delete?</p>
				<p>{title}</p>
			</div>
			<div className={style.buttonWrap}>
				<button className={button.cancel} data-close-model>
					Cancel
				</button>
				<button className={button.error} onClick={onDelete}>
					Delete
				</button>
			</div>
		</div>
	);
};

DeletePostModel.propTypes = {
	title: PropTypes.string,
	onDelete: PropTypes.func,
};

export default DeletePostModel;
