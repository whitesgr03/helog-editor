// Packages
import { useOutletContext, Link } from "react-router-dom";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Error.module.css";
import image from "../../styles/utils/image.module.css";

const Error = ({ message = null }) => {
	const { error } = useOutletContext();

	const errorMessage =
		(typeof message === "string" && message) ||
		"Please come back later or if you have any questions, please contact us.";

	console.error(message || error);

	return (
		<div className={style.error}>
			<span className={`${image.icon} ${style.alert}`} />
			<p>Our apologies, there has been an error.</p>
			<p>{errorMessage}</p>
			<p>
				Back to <Link to="/">Home</Link> Page.
			</p>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Error;
