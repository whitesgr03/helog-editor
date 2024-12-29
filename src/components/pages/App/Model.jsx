// Packages
import PropTypes from "prop-types";

// Styles
import style from ".Model.module.css";
import image from "../../../styles/image.module.css";
import button from "../../../styles/button.module.css";
import { blurWindow } from "../../../styles/bgc.module.css";

const Model = ({ onModel, model }) => {
	const handleCloseModel = e => e.target.dataset.closeModel && onModel(null);
	return (
		<div
			className={blurWindow}
			onClick={handleCloseModel}
			data-close-model
			data-testid={"blurBgc"}
		>
			<div className={style.model}>
				<button
					type="button"
					className={button.closeBtn}
					data-close-model
				>
					<span className={`${image.icon} ${button.close}`} />
				</button>
				{model}
			</div>
		</div>
	);
};

Model.propTypes = {
	onModel: PropTypes.func,
	model: PropTypes.object,
};

export default Model;
