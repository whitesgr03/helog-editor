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
			<div className={style.message}>
				<p>Our apologies, there has been an error.</p>
				<p>{errorMessage}</p>
			</div>
			<Link to="/" className={style.link}>
				Back to Home Page.
			</Link>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Error;
