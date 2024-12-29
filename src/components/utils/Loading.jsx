// Styles
import styles from "./Loading.module.css";
import imageStyles from "../../styles/image.module.css";

const Loading = () => {
	return (
		<div className={styles.loading}>
			<span className={`${imageStyles.icon} ${styles.load}`} />
			Loading ...
		</div>
	);
};

export default Loading;
