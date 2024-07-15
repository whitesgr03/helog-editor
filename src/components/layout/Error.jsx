// Packages
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Error.module.css";
import image from "../../styles/utils/image.module.css";

// Variable
const defaultMessage =
	"Please come back later or if you have any questions, please contact us.";

const Error = ({ message = null }) => {
	const { error } = useOutletContext();

	const errorMessage =
		(typeof message === "string" && message) || defaultMessage;

	console.error(message || error);

	return (
		<div className={style.error}>
			<span className={`${image.icon} ${style.alert}`} />
			<p>Our apologies, there has been an error.</p>
			<p>{errorMessage}</p>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Error;
