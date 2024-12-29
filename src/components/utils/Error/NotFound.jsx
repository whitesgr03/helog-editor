// Styles
import style from "../../styles/layout/Error.module.css";
import image from "../../styles/utils/image.module.css";

const NotFound = () => {
	return (
		<div className={style.error}>
			<span className={`${image.icon} ${style.alert}`} />
			<h2>Page Not Found</h2>
			<div className={style.message}>
				<p>Our apologies, there has been an error.</p>
				<p>The page you are looking for could not be found.</p>
				<p>You may surf over to our other pages.</p>
			</div>
		</div>
	);
};

export default NotFound;
