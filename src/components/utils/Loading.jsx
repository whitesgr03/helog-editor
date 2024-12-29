// Styles
import style from "./Loading.module.css";
import image from "../../styles/image.module.css";

const Loading = () => {
	return (
		<div className={style.loading}>
			<span className={`${image.icon} ${style.load}`} />
			Loading ...
		</div>
	);
};

export default Loading;
