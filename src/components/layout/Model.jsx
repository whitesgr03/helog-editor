// Packages
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Model.module.css";
import image from "../../styles/utils/image.module.css";
import button from "../../styles/utils/button.module.css";
import { blurWindow } from "../../styles/utils/bgc.module.css";

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
