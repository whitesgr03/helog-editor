// Packages
import PropTypes from "prop-types";

// Styles
import styles from ".Model.module.css";
import imageStyles from "../../../styles/image.module.css";
import buttonStlyes from "../../../styles/button.module.css";
import bgcStyles from "../../../styles/bgc.module.css";

export const Model = ({ onModel, model }) => {
	const handleCloseModel = e => e.target.dataset.closeModel && onModel(null);
	return (
		<div
			className={bgcStyles.blurWindow}
			onClick={handleCloseModel}
			data-close-model
			data-testid={"blurBgc"}
		>
			<div className={styles.model}>
				<button
					type="button"
					className={buttonStlyes.closeBtn}
					data-close-model
				>
					<span
						className={`${imageStyles.icon} ${buttonStlyes.close}`}
					/>
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
